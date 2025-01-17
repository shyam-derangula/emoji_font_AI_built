'use client'

import { useState, useMemo, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Copy, Star, X, Moon, Sun } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from 'next/link'
import emojiData from './emoji-data.json'

export default function EmojiList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const { toast } = useToast()

  const categories = useMemo(() => ['all', ...Object.keys(emojiData)], [])

  const allEmojis = useMemo(() => 
    Object.values(emojiData).flat(), 
    []
  )

  const filteredEmojis = useMemo(() => 
    allEmojis.filter(emoji => 
      (selectedCategory === 'all' || emojiData[selectedCategory].includes(emoji)) &&
      (emoji.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emoji.emoji.includes(searchTerm))
    ),
    [allEmojis, searchTerm, selectedCategory]
  )

  const paginatedEmojis = useMemo(() => {
    const startIndex = (currentPage - 1) * 48
    return filteredEmojis.slice(startIndex, startIndex + 48)
  }, [filteredEmojis, currentPage])

  const totalPages = Math.ceil(filteredEmojis.length / 48)

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites')
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }
    const storedTheme = localStorage.getItem('theme')
    if (storedTheme) {
      setIsDarkMode(storedTheme === 'dark')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
    document.body.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  const copyToClipboard = (emojis: string[]) => {
    const textToCopy = emojis.join(' ')
    navigator.clipboard.writeText(textToCopy).then(() => {
      toast({
        title: "Copied!",
        description: `${textToCopy} has been copied to your clipboard.`,
      })
    }, (err) => {
      console.error('Could not copy text: ', err)
    })
  }

  const toggleEmojiSelection = (emoji: string) => {
    setSelectedEmojis(prev => 
      prev.includes(emoji) ? prev.filter(e => e !== emoji) : [...prev, emoji]
    )
  }

  const toggleFavorite = (emoji: string) => {
    setFavorites(prev => 
      prev.includes(emoji) ? prev.filter(e => e !== emoji) : [...prev, emoji]
    )
  }

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev)
  }

  const renderEmojiGrid = (emojis: Array<{emoji: string, name: string}>) => (
    <div className="grid grid-cols-6 gap-4 p-4">
      {emojis.map((emoji, index) => (
        <div key={index} className="relative group">
          <Checkbox
            checked={selectedEmojis.includes(emoji.emoji)}
            onCheckedChange={() => toggleEmojiSelection(emoji.emoji)}
            className="absolute top-1 left-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
          />
          <div className={`w-full aspect-square ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-md flex flex-col items-center justify-center ${isDarkMode ? 'group-hover:bg-gray-700' : 'group-hover:bg-gray-300'} transition-colors`}>
            <span className="text-4xl mb-2">{emoji.emoji}</span>
            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                onClick={() => copyToClipboard([emoji.emoji])}
                variant="ghost"
                size="icon"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => toggleFavorite(emoji.emoji)}
                variant="ghost"
                size="icon"
              >
                <Star className={`h-4 w-4 ${favorites.includes(emoji.emoji) ? 'fill-yellow-500' : ''}`} />
              </Button>
            </div>
          </div>
          <span className={`absolute bottom-1 left-1 right-1 text-xs text-center opacity-0 group-hover:opacity-100 transition-opacity ${isDarkMode ? 'bg-gray-800 bg-opacity-75' : 'bg-gray-200 bg-opacity-75'} rounded p-1`}>
            {emoji.name}
          </span>
        </div>
      ))}
    </div>
  )

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <header className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} shadow-md`}>
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Emoji Explorer</h1>
          <div className="flex items-center space-x-4">
            <Link href="/font-changer-app" className={`${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}>
              Font Changer
            </Link>
            <Button onClick={toggleTheme} variant="ghost" size="icon">
              {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
          <Input
            type="text"
            placeholder="Search emojis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`flex-grow ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-black border-gray-300'}`}
          />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className={`w-full sm:w-[180px] ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-black border-gray-300'}`}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={() => copyToClipboard(selectedEmojis)}
            disabled={selectedEmojis.length === 0}
            className={`${isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
          >
            Copy Selected ({selectedEmojis.length})
          </Button>
        </div>

        {favorites.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Favorites</h2>
            <div className="flex flex-wrap gap-4">
              {favorites.map((emoji, index) => (
                <div key={index} className="relative group">
                  <div className={`w-12 h-12 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-md flex items-center justify-center ${isDarkMode ? 'group-hover:bg-gray-700' : 'group-hover:bg-gray-300'} transition-colors`}>
                    <span className="text-2xl">{emoji}</span>
                  </div>
                  <Button
                    onClick={() => toggleFavorite(emoji)}
                    variant="ghost"
                    size="icon"
                    className={`absolute -top-2 -right-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded-full opacity-0 group-hover:opacity-100 transition-opacity`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <ScrollArea className={`h-[calc(100vh-400px)] rounded-md border ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>
          {renderEmojiGrid(paginatedEmojis)}
        </ScrollArea>

        <div className="flex justify-center mt-4 space-x-2">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className={`px-4 py-2 rounded-md ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </main>

      <footer className={`${isDarkMode ? 'bg-gray-900 text-gray-400' : 'bg-gray-100 text-gray-600'} shadow-md mt-8`}>
        <div className="container mx-auto py-4 px-4 text-center">
          <p>&copy; 2023 Emoji Explorer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

