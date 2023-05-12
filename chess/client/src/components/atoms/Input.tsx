import "./Input.scss"
import React from "react"

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

export const Input = (props: Props) => {

    const className = "Input " + (props.className ?? "")

    return <input {...props} className={className} />
}