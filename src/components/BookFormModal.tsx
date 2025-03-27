"use client"

import React, { useState } from "react"
import { BookForm } from "./BookForm"
import { Dialog, Flex, Button, IconButton } from "@radix-ui/themes"
import { PlusIcon, Cross2Icon } from "@radix-ui/react-icons"

export const BookFormModal = () => {
    const [open, setOpen] = useState(false)

    const handleFormSubmit = () => {
        // Close the dialog when form is submitted
        setOpen(false)
    }

    return (
        <div>
            <Dialog.Root open={open} onOpenChange={setOpen}>
                <Dialog.Trigger>
                    <Button
                        size="3"
                        style={{
                            position: "fixed",
                            bottom: "20px",
                            right: "20px",
                            borderRadius: "50%",
                            width: "56px",
                            height: "56px",
                            padding: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 999,
                            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                        }}
                    >
                        <PlusIcon width="24" height="24" />
                    </Button>
                </Dialog.Trigger>

                <Dialog.Content style={{ maxWidth: "90vw", width: "350px" }}>
                    <Flex justify="between" align="center" mb="3">
                        <Dialog.Title>Add New Book</Dialog.Title>
                        <Dialog.Close>
                            <IconButton variant="ghost" size="2" color="gray">
                                <Cross2Icon width="18" height="18" />
                            </IconButton>
                        </Dialog.Close>
                    </Flex>

                    <Flex direction="column" gap="3">
                        <BookForm
                            inModal={true}
                            onSubmitSuccess={handleFormSubmit}
                        />
                    </Flex>
                </Dialog.Content>
            </Dialog.Root>
        </div>
    )
}
