import { persistentAtom } from "@nanostores/persistent"
import { onMount, atom, computed } from "nanostores"
import { useEffect } from "react"

// Define the Book type
export type Book = {
    id: string
    name: string
    author?: string
    description?: string
    picture?: string
}

// Create a store for books
export const $books = persistentAtom<Book[]>("bookRecords", [], {
    encode: JSON.stringify,
    decode: JSON.parse,
})

export const $seedCompleted = persistentAtom<boolean>("seedCompleted", false, {
    encode: JSON.stringify,
    decode: JSON.parse,
})

// Add a new state for name filter
export const $nameFilter = atom("")

// Create a computed store for filtered books
export const $filteredBooks = computed(
    [$books, $nameFilter],
    (books, nameFilter) => {
        if (!nameFilter.trim()) return books

        return books.filter((book) =>
            book.name.toLowerCase().includes(nameFilter.toLowerCase())
        )
    }
)

// Helper function to add a book
export function addBook(book: Omit<Book, "id">) {
    const newBook = {
        ...book,
        id: crypto.randomUUID(),
    }

    $books.set([...$books.get(), newBook])
    return newBook
}

// Helper function to remove a book by ID
export function removeBook(id: string) {
    const currentBooks = $books.get()
    const updatedBooks = currentBooks.filter((book) => book.id !== id)
    $books.set(updatedBooks)
}

// Seed data placeholder - Replace with your actual data later
const seedData: Omit<Book, "id">[] = [
    // You can replace this with your actual seed data later
    // Example structure:
    // {
    //     name: "Book Title",
    //     author: "Author Name",
    //     description: "Book description goes here...",
    //     picture: "https://example.com/book-cover.jpg"
    // },

    {
        name: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        description:
            "A classic novel set in the Roaring Twenties, exploring themes of wealth and longing.",
        picture:
            "https://www.hachette.com.au/content/uploads/jacket/9780732297350.jpg",
    },
    {
        name: "To Kill a Mockingbird",
        author: "Harper Lee",
        description:
            "A story of racial injustice and moral growth in the American South.",
        picture:
            "https://images-na.ssl-images-amazon.com/images/I/81OdwZG6DhL.jpg",
    },
    {
        name: "1984",
        author: "George Orwell",
        description:
            "A dystopian novel about totalitarianism and surveillance.",
        picture:
            "https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg",
    },
    {
        name: "Moby-Dick",
        author: "Herman Melville",
        description:
            "An epic tale of obsession and revenge against a white whale.",
        picture:
            "https://images-na.ssl-images-amazon.com/images/I/81PR4l6DyhL.jpg",
    },
    {
        name: "Pride and Prejudice",
        author: "Jane Austen",
        description:
            "A romantic novel about manners, marriage, and social status.",
        picture:
            "https://images-na.ssl-images-amazon.com/images/I/81A-mvlo+QL.jpg",
    },
    {
        name: "The Catcher in the Rye",
        author: "J.D. Salinger",
        description: "A story of teenage rebellion and identity crisis.",
        picture:
            "https://images-na.ssl-images-amazon.com/images/I/71Q1Iu4suSL.jpg",
    },
    {
        name: "Brave New World",
        author: "Aldous Huxley",
        description:
            "A dystopian vision of a future society controlled by technology and pleasure.",
        picture:
            "https://images-na.ssl-images-amazon.com/images/I/81zLwAwD9-L.jpg",
    },
    {
        name: "The Hobbit",
        author: "J.R.R. Tolkien",
        description:
            "A fantasy adventure following Bilbo Baggins' journey to recover treasure from a dragon.",
        picture:
            "https://images-na.ssl-images-amazon.com/images/I/91b0C2YNSrL.jpg",
    },
    {
        name: "War and Peace",
        author: "Leo Tolstoy",
        description:
            "A historical novel that intertwines the lives of aristocrats during the Napoleonic wars.",
        picture:
            "https://images-na.ssl-images-amazon.com/images/I/91A+4N7mJ-L.jpg",
    },
    {
        name: "Crime and Punishment",
        author: "Fyodor Dostoevsky",
        description: "A psychological exploration of guilt and redemption.",
        picture:
            "https://images-na.ssl-images-amazon.com/images/I/81d6GXV3x-L.jpg",
    },
    {
        name: "The Odyssey",
        author: "Homer",
        description:
            "An epic poem about Odysseus' journey home after the Trojan War.",
        picture:
            "https://images-na.ssl-images-amazon.com/images/I/81tEgsxpNZS.jpg",
    },
    {
        name: "The Brothers Karamazov",
        author: "Fyodor Dostoevsky",
        description:
            "A deep philosophical novel exploring morality, faith, and free will.",
        picture:
            "https://images-na.ssl-images-amazon.com/images/I/91TVz3k4l-L.jpg",
    },
    {
        name: "Frankenstein",
        author: "Mary Shelley",
        description:
            "A gothic horror novel about a scientist who creates a monster.",
        picture:
            "https://images-na.ssl-images-amazon.com/images/I/81FStZ3sb2L.jpg",
    },
    {
        name: "Dracula",
        author: "Bram Stoker",
        description:
            "A horror classic introducing the legendary vampire Count Dracula.",
        picture:
            "https://images-na.ssl-images-amazon.com/images/I/91OINeHnJGL.jpg",
    },
    {
        name: "Jane Eyre",
        author: "Charlotte Brontë",
        description:
            "A novel about an orphan's journey to independence and love.",
        picture:
            "https://images-na.ssl-images-amazon.com/images/I/81z4bDl6H-L.jpg",
    },
    {
        name: "Wuthering Heights",
        author: "Emily Brontë",
        description: "A tale of love and revenge set on the Yorkshire moors.",
        picture:
            "https://images-na.ssl-images-amazon.com/images/I/91Ex2A5VwQL.jpg",
    },
    {
        name: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        description:
            "An epic fantasy saga about the battle to destroy the One Ring.",
        picture:
            "https://images-na.ssl-images-amazon.com/images/I/91SZSW8qSsL.jpg",
    },
    {
        name: "The Picture of Dorian Gray",
        author: "Oscar Wilde",
        description:
            "A novel exploring vanity, morality, and the consequences of indulgence.",
        picture:
            "https://images-na.ssl-images-amazon.com/images/I/81t2CVWEsUL.jpg",
    },
    {
        name: "The Stranger",
        author: "Albert Camus",
        description: "A novel of existentialism and detachment from society.",
        picture:
            "https://images-na.ssl-images-amazon.com/images/I/81OthjkJBuL.jpg",
    },
    {
        name: "Fahrenheit 451",
        author: "Ray Bradbury",
        description:
            "A dystopian novel about a future where books are outlawed and burned.",
        picture:
            "https://images-na.ssl-images-amazon.com/images/I/71OFqSRFDgL.jpg",
    },
    {
        name: "Les Misérables",
        author: "Victor Hugo",
        description:
            "A sweeping story of redemption, justice, and love in 19th-century France.",
        picture: "https://m.media-amazon.com/images/I/71oZG5DGHFL._SY466_.jpg",
    },
]

/**
 * Seeds the book store with initial data if not already done
 */
export function seedBookStore(): void {
    // Check if seeding has already been completed
    if ($seedCompleted.get() === true) {
        return
    }

    // Only seed if we have data and it hasn't been done yet
    if (seedData.length > 0) {
        const existingBooks = $books.get()

        // Only seed if the store is empty
        if (existingBooks.length === 0) {
            const booksWithIds = seedData.map((book) => ({
                ...book,
                id: crypto.randomUUID(),
            }))
            $books.set(booksWithIds)
        }
    }

    // Mark seeding as completed
    $seedCompleted.set(true)
}

// This will run the seed function when the store is mounted
onMount($books, () => {
    console.log("Mounting book store...")
    seedBookStore()
})

/**
 * React hook to check and run seed on component mount
 */
export function useSeedBooks(): void {
    useEffect(() => {
        seedBookStore()
    }, [])
}
