use std::fmt::format;
use std::process::Command;
use clap::{Parser, Subcommand};

/// Simple program to greet a person
#[derive(Parser, Debug)]
#[command(version, about, long_about = None)]
struct Args {
    #[command(subcommand)]
    command: Commands
}

#[derive(Debug, Subcommand)]
enum Commands {

    Update {
        domain: String,
        port: u32,
        websocket: Option<bool>
    }

}

fn main() {
    let args = Args::parse();

    match (args.command) {
        Commands::Update { domain, port, websocket } => {
            update(domain, port, websocket.unwrap_or(false));
        }
    }
}

fn update(domain: String, port: u32, websocket: bool) {

    let websocket_options = match websocket {
        false => "".to_string(),
        true => "proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection \"upgrade\";".to_string()
    };

    let nginx_config_file = format!("server {{
    server_name {domain}.armandcolin.fr;

    location / {{
        proxy_pass http://127.0.0.1:{port}/;
        {websocket_options}
    }}

    listen 443 ssl;

    ssl_certificate /etc/certificates/armandcolin.fr/public.cer;
    ssl_certificate_key /etc/certificates/armandcolin.fr/private.key;
}}

server {{
    if ($host = {domain}.armandcolin.fr) {{
        return 301 https://$host$request_uri;
    }}

    listen 80;

    server_name {domain}.armandcolin.fr;
    # return 404;
    root /var/www/{domain}.armandcolin.fr;
    index index.html;
    }}
");

    let file_destination = format!("/etc/nginx/sites-enabled/{domain}.armandcolin.fr");

    std::fs::write(file_destination, nginx_config_file).expect("Failed to write config file");

    reload();
}

fn reload() {
    let output = Command::new("systemctl")
            .arg("reload")
            .arg("nginx")
            .output()
            .expect("failed to execute process");

    if !output.status.success() {
        eprintln!("{}", String::from_utf8_lossy(&output.stderr));
    }
}