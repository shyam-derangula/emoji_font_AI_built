'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Moon, Sun } from 'lucide-react'
import Link from 'next/link'

const fonts = [
  "Arial", "Helvetica", "Times New Roman", "Courier New", "Verdana",
  "Georgia", "Palatino", "Garamond", "Bookman", "Comic Sans MS",
  "Trebuchet MS", "Arial Black", "Impact"
  // ... add more fonts here
]

export default function FontChanger() {
  const [text, setText] = useState('')
  const [selectedFont, setSelectedFont] = useState('Arial')
  const [wordCount, setWordCount] = useState(0)
  const [spellCheckErrors, setSpellCheckErrors] = useState<string[]>([])
  const [isDarkMode, setIsDarkMode] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const words = text.trim().split(/\s+/)
    setWordCount(words.length === 1 && words[0] === '' ? 0 : words.length)

    // Simple spell check (replace with a more robust solution in production)
    const errors = words.filter(word => !word.match(/^[a-zA-Z]+$/))
    setSpellCheckErrors(errors)
  }, [text])

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme')
    if (storedTheme) {
      setIsDarkMode(storedTheme === 'dark')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
    document.body.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText()
      setText(clipboardText)
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err)
    }
  }

  const handleFontChange = (font: string) => {
    setSelectedFont(font)
  }

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev)
  }

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <header className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} shadow-md`}>
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Font Changer</h1>
          <div className="flex items-center space-x-4">
            <Link href="/" className={`${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}>
              Emoji Explorer
            </Link>
            <Button onClick={toggleTheme} variant="ghost" size="icon">
              {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 flex space-x-4">
        <div className="w-2/3">
          <div className="mb-4">
            <Select onValueChange={handleFontChange} value={selectedFont}>
              <SelectTrigger className={`w-full ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-black border-gray-300'}`}>
                <SelectValue placeholder="Select a font" />
              </SelectTrigger>
              <SelectContent>
                {fonts.map((font) => (
                  <SelectItem key={font} value={font}>
                    {font}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mb-4">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter or paste your text here"
              rows={10}
              className={`w-full p-2 border rounded ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-black border-gray-300'}`}
              style={{ fontFamily: selectedFont }}
            />
          </div>
          <div className="flex space-x-2 mb-4">
            <Button onClick={handlePaste} className={isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}>Paste from Clipboard</Button>
            <Input
              type="text"
              value={`Word Count: ${wordCount}`}
              readOnly
              className={`flex-grow ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-black border-gray-300'}`}
            />
          </div>
          {spellCheckErrors.length > 0 && (
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-2">Possible Spelling Errors:</h2>
              <ul className="list-disc list-inside">
                {spellCheckErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="w-1/3">
          <h2 className="text-2xl font-bold mb-4">Font Preview</h2>
          <ScrollArea className={`h-[calc(100vh-200px)] rounded-md border ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>
            {fonts.map((font) => (
              <div key={font} className="mb-4 p-2 border rounded" style={{ fontFamily: font }}>
                <h3 className="text-lg font-bold mb-2">{font}</h3>
                <p>The quick brown fox jumps over the lazy dog.</p>
              </div>
            ))}
          </ScrollArea>
        </div>
      </main>

      <footer className={`${isDarkMode ? 'bg-gray-900 text-gray-400' : 'bg-gray-100 text-gray-600'} shadow-md mt-8`}>
        <div className="container mx-auto py-4 px-4 text-center">
          <p>&copy; 2023 Font Changer. All rights reserved.</p>
        </div>
      </footer>
      <Toaster />
    </div>
  )
}

