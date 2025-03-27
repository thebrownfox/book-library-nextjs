"use client"

import React, { useState } from "react"
import { Button, TextField, TextArea, Flex, Text, Box } from "@radix-ui/themes"
import { $books, type Book } from "@/store/bookStore"

type BookFormProps = {
    inModal?: boolean
    onSubmitSuccess?: () => void
}

export const BookForm = ({
    inModal = false,
    onSubmitSuccess,
}: BookFormProps) => {
    const [formData, setFormData] = useState({
        name: "",
        author: "",
        description: "",
        picture: "",
    })
    const [errors, setErrors] = useState<{
        name?: string
        description?: string
    }>({})

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target

        // Handle character limit for description
        if (name === "description" && value.length > 300) {
            return
        }

        setFormData((prev) => ({ ...prev, [name]: value }))

        // Clear errors when field is modified
        if (errors[name as keyof typeof errors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }))
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Validate form
        const newErrors: typeof errors = {}

        if (!formData.name.trim()) {
            newErrors.name = "Book name is required"
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        // Create new book record
        const newBook: Book = {
            id: crypto.randomUUID(),
            name: formData.name.trim(),
            author: formData.author.trim() || undefined,
            description: formData.description.trim() || undefined,
            picture: formData.picture.trim() || undefined,
        }

        console.log("New Book:", newBook)
        // Add to store
        $books.set([...$books.get(), newBook])
        // Reset form
        setFormData({
            name: "",
            author: "",
            description: "",
            picture: "",
        })

        // Call the success callback if provided
        if (onSubmitSuccess) {
            onSubmitSuccess()
        }
    }

    return (
        <Box
            className="book-form"
            p={inModal ? "0" : "4"}
            style={{ maxWidth: "500px" }}
        >
            <form onSubmit={handleSubmit}>
                <Flex direction="column" gap="3">
                    {!inModal && (
                        <Text size="5" weight="bold" mb="2">
                            Add New Book
                        </Text>
                    )}

                    <Box mb="3">
                        <Text
                            as="label"
                            size="2"
                            weight="bold"
                            htmlFor="name"
                            mb="1"
                        >
                            Book Name *
                        </Text>
                        <TextField.Root
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter book name"
                            color={errors.name ? "red" : undefined}
                        />
                        {errors.name && (
                            <Text color="red" size="1" mt="1">
                                {errors.name}
                            </Text>
                        )}
                    </Box>

                    <Box mb="3">
                        <Text
                            as="label"
                            size="2"
                            weight="bold"
                            htmlFor="author"
                            mb="1"
                        >
                            Author
                        </Text>
                        <TextField.Root
                            name="author"
                            id="author"
                            value={formData.author}
                            onChange={handleChange}
                            placeholder="Enter author name"
                        />
                    </Box>

                    <Box mb="3">
                        <Text
                            as="label"
                            size="2"
                            weight="bold"
                            htmlFor="description"
                            mb="1"
                        >
                            Description (max 300 characters)
                        </Text>
                        <TextArea
                            name="description"
                            id="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter short description"
                        />
                        <Text size="1" color="gray" mt="1">
                            {formData.description.length}/300 characters
                        </Text>
                    </Box>

                    <Box mb="3">
                        <Text
                            as="label"
                            size="2"
                            weight="bold"
                            htmlFor="picture"
                            mb="1"
                        >
                            Picture URL
                        </Text>
                        <TextField.Root
                            name="picture"
                            id="picture"
                            value={formData.picture}
                            onChange={handleChange}
                            placeholder="Enter picture URL"
                        />
                    </Box>

                    <Button type="submit" mt="2">
                        Add Book
                    </Button>
                </Flex>
            </form>
        </Box>
    )
}
