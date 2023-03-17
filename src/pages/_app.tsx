import type { AppProps } from 'next/app'
import { useState, useEffect } from 'react'
import './App.css'
import { Configuration, OpenAIApi } from 'openai'
import getConfig from 'next/config'

export default function App({ Component, pageProps }: AppProps) {
  const defaultUrl = "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"
  const [imageUrl, setImageUrl] = useState(defaultUrl)
  const [prompt, setPrompt] = useState(defaultUrl)
  const [loading, setLoading] = useState(false)
  const [displayedLoadingText, setDisplayedLoadingText] = useState("")
  const loadingText = "Creating image, please wait..."

  const { publicRuntimeConfig } = getConfig()
  const apiKey = (typeof publicRuntimeConfig !== 'undefined' && publicRuntimeConfig.dalleApiKey) ? publicRuntimeConfig.dalleApiKey : process.env.DALL_E_API_KEY;
  if (!apiKey) {
    throw new Error("Dall-E apiKey is not defined in config file")
  }

  const configuration = new Configuration({ apiKey })
  const openai = new OpenAIApi(configuration)

  const generateimage = async () => {
    setLoading(true)
    const res = await openai.createImage({ prompt: prompt, n: 1, size: "512x512" })
    setImageUrl(res.data.data[0].url || "image not found")
    setLoading(false)
  }

  useEffect(() => {
    if (loading) {
      let i = 0
      const typing = setInterval(() => {
        setDisplayedLoadingText(loadingText.slice(0, i))
        i++
        if (i > loadingText.length + 1) {
          i = 1
          setDisplayedLoadingText(loadingText.slice(0, i))
        }
      }, 100)
      return () => clearInterval(typing)
    }
  }, [loading])

  const sendEmail = (url = "") => {
    const message = `Here your image download link: ${url}`
    window.location.href = `mailto:donald.vear@gmail.com?subject=Image Download Link&body=${message}`
  }
  return <div className="app-main">
    <h2>Create Images With Your Mind</h2>
    <textarea
      className="app-input"
      placeholder="Create any type of image you can think of with as much added description as you would like"
      onChange={(evt) => setPrompt(evt.target.value)}
    />
    <button onClick={generateimage}>Generate Image</button>
    {loading
      ? (
        <>
          <h3>{displayedLoadingText}</h3>
          <div className="lds-ripple">
            <div></div>
            <div></div>
          </div>
        </>
      )

      : <img
        src={imageUrl}
        className="result-image"
        alt="result"
        onClick={() => sendEmail(imageUrl)}
        style={{ cursor: "pointer" }}
      />
    }
  </div >
}
