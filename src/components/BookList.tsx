"use client"

import React, { useState, useEffect, useRef } from "react"
import { useStore } from "@nanostores/react"
import { $filteredBooks, $nameFilter } from "@/store/bookStore"
import {
    Box,
    Heading,
    Text,
    Card,
    Flex,
    AspectRatio,
    ScrollArea,
    TextField,
} from "@radix-ui/themes"
import { BookDeleteDialog } from "./BookDeleteDialog"

// Simple gray placeholder as data URL - much faster than external requests
const PLACEHOLDER_IMAGE =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' text-anchor='middle' dominant-baseline='middle' fill='%23999999'%3ENo Image%3C/text%3E%3C/svg%3E"

// Component to handle image with fallback
const BookCoverImage = ({ src, alt }: { src?: string; alt: string }) => {
    const [imgSrc, setImgSrc] = useState(src || PLACEHOLDER_IMAGE)
    const imgRef = useRef<HTMLImageElement>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        // Reset image source when prop changes
        setImgSrc(src || PLACEHOLDER_IMAGE)

        // Set a timeout to check if image loads within reasonable time
        if (src) {
            timeoutRef.current = setTimeout(() => {
                // If image is still not complete after timeout, use placeholder
                if (imgRef.current && !imgRef.current.complete) {
                    setImgSrc(PLACEHOLDER_IMAGE)
                }
            }, 5000) // 5 second timeout
        }

        return () => {
            // Clear timeout on unmount or when src changes
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [src])

    const handleError = () => {
        setImgSrc(PLACEHOLDER_IMAGE)
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
    }

    const handleLoad = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
    }

    return (
        <img
            ref={imgRef}
            src={imgSrc}
            alt={alt}
            style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
                borderRadius: "var(--radius-2)",
            }}
            onError={handleError}
            onLoad={handleLoad}
        />
    )
}

export const BookList = () => {
    const books = useStore($filteredBooks)
    const nameFilter = useStore($nameFilter)

    return (
        <Box
            className="book-list"
            p={{
                initial: "2",
                lg: "3",
            }}
        >
            <Heading size="5" mb="4">
                Book Collection
            </Heading>

            <Box
                mb="3"
                maxWidth={{
                    initial: "100%",
                    sm: "300px",
                }}
            >
                <TextField.Root
                    placeholder="Filter books by name..."
                    value={nameFilter}
                    onChange={(e) => $nameFilter.set(e.target.value)}
                />
            </Box>

            {books.length === 0 ? (
                <Text color="gray">
                    {nameFilter.trim()
                        ? "No books match your filter."
                        : "No books have been added yet."}
                </Text>
            ) : (
                <ScrollArea
                    style={{ height: "calc(100vh - 200px)" }}
                    scrollbars="vertical"
                >
                    {/* TODO: Try to refactor this to grid. Flex behaves strange in some cases. */}
                    <Flex
                        direction="row"
                        gap={{
                            initial: "2",
                            lg: "3",
                        }}
                        width="100%"
                        wrap="wrap"
                    >
                        {books.map((book) => (
                            <Box
                                key={book.id}
                                width={{
                                    initial: "100%",
                                    sm: "49%",
                                    lg: "24%",
                                }}
                            >
                                <Card
                                    style={{
                                        height: "100%",
                                        width: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                    }}
                                >
                                    {/* Image Section - Fixed ratio */}
                                    <AspectRatio ratio={4 / 3}>
                                        <BookCoverImage
                                            src={book.picture}
                                            alt={`Cover of ${book.name}`}
                                        />
                                    </AspectRatio>

                                    {/* Content Section - Fills remaining height */}
                                    <Flex
                                        p="3"
                                        direction="column"
                                        flexGrow="1"
                                        flexShrink="1"
                                    >
                                        <Flex
                                            justify="between"
                                            align="start"
                                            mb="1"
                                        >
                                            <Heading as="h3" size="3">
                                                {book.name}
                                            </Heading>
                                            <BookDeleteDialog
                                                bookId={book.id}
                                                bookName={book.name}
                                            />
                                        </Flex>

                                        {book.author && (
                                            <Text
                                                as="div"
                                                size="2"
                                                color="gray"
                                                mb="2"
                                            >
                                                by {book.author}
                                            </Text>
                                        )}

                                        {/* Description with auto overflow */}
                                        {book.description && (
                                            <ScrollArea
                                                style={{
                                                    flex: 1,
                                                    marginTop: "auto",
                                                }}
                                                scrollbars="vertical"
                                            >
                                                <Text as="p" size="2">
                                                    {book.description}
                                                </Text>
                                            </ScrollArea>
                                        )}
                                    </Flex>
                                </Card>
                            </Box>
                        ))}
                    </Flex>
                </ScrollArea>
            )}
        </Box>
    )
}
