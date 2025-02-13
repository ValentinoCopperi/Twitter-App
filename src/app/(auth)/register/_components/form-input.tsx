import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RegisterFormSchema } from '@/types/auth'
import { EyeIcon } from 'lucide-react'
import React from 'react'

const FormInput = ({
    name,
    label,
    type = 'text',
    placeholder,
    control
}: {
    name: keyof RegisterFormSchema,
    label: string,
    type?: string,
    placeholder: string,
    control: any
}) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</FormLabel>
                <FormControl>
                    <Input
                        type={type}
                        placeholder={placeholder}
                        {...field}
                        className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
            </FormItem>
        )}
    />
)

export default FormInput