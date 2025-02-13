import { createPost } from '@/actions/posts/post-actions';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { categories } from '@/types';
import { createPostSchema, CreatePostState } from '@/types/create-post';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

interface Props {
    form: UseFormReturn<z.infer<typeof createPostSchema>>
    formState: CreatePostState
    loading : boolean
}

const CategoryInput = ({ form, formState,loading}: Props) => {
    return (
        <FormField
            control={form.control}
            name='category'
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="font-semibold">Select category</FormLabel>
                    <Select
                        {...field}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={loading}
                    >
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {
                                categories.map((categories, index) => (
                                    <SelectItem key={index} value={categories}>
                                        {categories}
                                    </SelectItem>
                                ))
                           }
                        </SelectContent>
                    </Select>
                    {formState?.errors?.category && (
                        <FormMessage>
                            {formState.errors.category.join(', ')}
                        </FormMessage>
                    )}
                </FormItem>
            )}
        />
    )
}

export default CategoryInput