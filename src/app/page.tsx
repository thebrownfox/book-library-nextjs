"use client"

import { BookForm } from "@/components/BookForm"
import { BookFormModal } from "@/components/BookFormModal"
import { BookList } from "@/components/BookList"
import { Box, Card, Flex } from "@radix-ui/themes"

export default function Home() {
    return (
        <main>
            <Flex
                align="center"
                justify="center"
                gap="2"
                height="100%"
                p={{
                    initial: "2",
                    lg: "3",
                }}
            >
                <Card style={{ width: "100%", height: "100%" }}>
                    <Flex
                        direction={{ initial: "column", md: "row" }}
                        gap={{
                            initial: "2",
                            lg: "3",
                        }}
                        p={{
                            initial: "2",
                            lg: "3",
                        }}
                    >
                        {/* Show BookForm only on sm breakpoint and above */}
                        <Box
                            display={{ initial: "none", md: "block" }}
                            flexGrow="1"
                            minWidth={{ sm: "300px" }}
                        >
                            <BookForm />
                        </Box>
                        <Box
                            flexGrow="1"
                            minWidth={{ sm: "300px" }}
                            width="100%"
                        >
                            <BookList />
                        </Box>
                    </Flex>
                </Card>
            </Flex>

            {/* Show BookFormModal only on initial and xs breakpoints */}
            <Box display={{ initial: "block", md: "none" }}>
                <BookFormModal />
            </Box>
        </main>
    )
}
