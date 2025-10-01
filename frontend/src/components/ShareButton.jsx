import { useState } from "react"
import { FiShare2, FiCopy, FiTwitter, FiFacebook, FiLinkedin, FiCheck } from "react-icons/fi"
import toast from "react-hot-toast"

function ShareButton({ blog, className = "" }) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareUrl = `${window.location.origin}/blog/${blog._id}`
  const shareTitle = blog.title
  const shareDescription = blog.content ? blog.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...' : ''

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success("Link copied to clipboard!")
      setTimeout(() => {
        setCopied(false)
        setIsOpen(false)
      }, 2000)
    } catch (error) {
      toast.error("Failed to copy link")
    }
  }

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`
    window.open(twitterUrl, '_blank', 'width=600,height=400')
    setIsOpen(false)
  }

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    window.open(facebookUrl, '_blank', 'width=600,height=400')
    setIsOpen(false)
  }

  const handleLinkedInShare = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    window.open(linkedinUrl, '_blank', 'width=600,height=400')
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-theme-bg-secondary text-theme-text-secondary hover:text-theme-text transition-colors duration-200"
      >
        <FiShare2 className="w-4 h-4" />
        <span className="font-medium">Share</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Share Menu */}
          <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Share this blog</h3>
              
              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 mb-2"
              >
                {copied ? (
                  <div className="w-5 h-5 flex items-center justify-center">
                    <FiCheck className="w-4 h-4 text-green-500" />
                  </div>
                ) : (
                  <FiCopy className="w-5 h-5 text-gray-500" />
                )}
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {copied ? "Copied!" : "Copy link"}
                </span>
              </button>

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-600 my-3"></div>

              {/* Social Media Options */}
              <div className="space-y-2">
                <button
                  onClick={handleTwitterShare}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <FiTwitter className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Share on Twitter</span>
                </button>

                <button
                  onClick={handleFacebookShare}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <FiFacebook className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Share on Facebook</span>
                </button>

                <button
                  onClick={handleLinkedInShare}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <FiLinkedin className="w-5 h-5 text-blue-700" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Share on LinkedIn</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ShareButton