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
    Table,
} from "@radix-ui/themes"
import { BookDeleteDialog } from "./BookDeleteDialog"
import { GridIcon, RowsIcon } from "@radix-ui/react-icons"
import { ToggleGroup } from "radix-ui"

import "./toggle.css"

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

type ViewType = "grid" | "table"

export const BookList = () => {
    const books = useStore($filteredBooks)
    const nameFilter = useStore($nameFilter)
    const [viewType, setViewType] = useState<ViewType>("grid")

    return (
        <Box
            className="book-list"
            p={{
                initial: "2",
                lg: "3",
            }}
        >
            <Flex justify="between" align="center" mb="4">
                <Heading size="5">Book Collection</Heading>
                {/* TODO: Refactor this to a theme component */}
                <ToggleGroup.Root
                    className="ToggleGroup"
                    type="single"
                    value={viewType}
                    onValueChange={(value) => {
                        if (value) setViewType(value as ViewType)
                    }}
                >
                    <ToggleGroup.Item
                        className="ToggleGroupItem"
                        value="grid"
                        aria-label="Grid view"
                    >
                        <GridIcon />
                    </ToggleGroup.Item>
                    <ToggleGroup.Item
                        className="ToggleGroupItem"
                        value="table"
                        aria-label="Table view"
                    >
                        <RowsIcon />
                    </ToggleGroup.Item>
                </ToggleGroup.Root>
            </Flex>

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
                    {viewType === "grid" ? (
                        // Grid View
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
                    ) : (
                        // Table View
                        <Table.Root variant="surface">
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeaderCell>
                                        Cover
                                    </Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>
                                        Title
                                    </Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>
                                        Author
                                    </Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>
                                        Description
                                    </Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {books.map((book) => (
                                    <Table.Row key={book.id}>
                                        <Table.Cell>
                                            <Box
                                                style={{
                                                    width: "60px",
                                                    height: "60px",
                                                }}
                                            >
                                                <BookCoverImage
                                                    src={book.picture}
                                                    alt={`Cover of ${book.name}`}
                                                />
                                            </Box>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Text weight="bold">
                                                {book.name}
                                            </Text>
                                        </Table.Cell>
                                        <Table.Cell>
                                            {book.author || "-"}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Text
                                                style={{
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: "vertical",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    maxWidth: "300px",
                                                }}
                                            >
                                                {book.description || "-"}
                                            </Text>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <BookDeleteDialog
                                                bookId={book.id}
                                                bookName={book.name}
                                            />
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    )}
                </ScrollArea>
            )}
        </Box>
    )
}
