import { ReactNode } from 'react'

interface InputFieldProps {
  label: string
  type?: 'text' | 'email' | 'number'
  placeholder: string
  icon?: ReactNode
}

export default function InputField({
  label,
  type = 'text',
  placeholder,
  icon,
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          {icon}
        </div>

        <input
          type={type}
          className="w-full rounded-md border border-gray-300 py-3 pl-10 pr-3 text-sm"
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}
