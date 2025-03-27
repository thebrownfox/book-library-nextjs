"use client"

import React from "react"
import { AlertDialog, Button, Em, Flex } from "@radix-ui/themes"
import { TrashIcon } from "@radix-ui/react-icons"
import { removeBook } from "@/store/bookStore"

type BookDeleteDialogProps = {
    bookId: string
    bookName: string
}

export const BookDeleteDialog = ({
    bookId,
    bookName,
}: BookDeleteDialogProps) => {
    const handleDelete = () => {
        removeBook(bookId)
    }

    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger>
                <Button color="red" variant="soft" size="1">
                    <TrashIcon width="14" height="14" />
                </Button>
            </AlertDialog.Trigger>

            <AlertDialog.Content>
                <AlertDialog.Title>Delete Book</AlertDialog.Title>
                <AlertDialog.Description>
                    Are you sure you want to delete <Em>{bookName}</Em>? This
                    action cannot be undone.
                </AlertDialog.Description>

                <Flex gap="3" mt="4" justify="end">
                    <AlertDialog.Cancel>
                        <Button variant="soft" color="gray">
                            Cancel
                        </Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action>
                        <Button
                            variant="solid"
                            color="red"
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    </AlertDialog.Action>
                </Flex>
            </AlertDialog.Content>
        </AlertDialog.Root>
    )
}
