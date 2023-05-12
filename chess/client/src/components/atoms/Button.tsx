import "./Button.scss"
import React from "react"

type Props = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

export const Button = (props: Props) => {
    const className = "Button " + (props.className ?? "")
    return <button {...props} className={className} />
}