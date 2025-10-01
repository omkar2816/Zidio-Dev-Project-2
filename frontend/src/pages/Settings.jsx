import { useState } from "react"
import { useSelector } from "react-redux"
import { useTheme } from "../contexts/ThemeContext"
import { 
  FiSun,
  FiMoon,
  FiBell,
  FiMail,
  FiShield,
  FiGlobe,
  FiLock,
  FiTrash2,
  FiDownload,
  FiUpload,
  FiSettings,
  FiCheck,
  FiX,
  FiInfo
} from "react-icons/fi"
import toast from "react-hot-toast"

function Settings() {
  const { user } = useSelector((state) => state.auth)
  const { theme, toggleTheme } = useTheme()
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    weeklyDigest: true,
    commentNotifications: true,
    likeNotifications: false,
    publicProfile: true,
    showEmail: false,
    showOnlineStatus: true,
    twoFactorAuth: false,
    language: 'en',
    timezone: 'UTC',
    autoSave: true,
    compactView: false
  })

  const handleSettingChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }))
    toast.success("Setting updated successfully!")
  }

  const handleSelectChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }))
    toast.success("Setting updated successfully!")
  }

  const exportData = () => {
    toast.success("Data export initiated! You'll receive an email shortly.")
  }

  const importData = () => {
    toast.info("Feature coming soon!")
  }

  const deleteAccount = () => {
    toast.error("Account deletion requires additional verification.")
  }

  const SettingToggle = ({ label, description, checked, onChange, icon: Icon, color = "blue" }) => (
    <div className="flex items-center justify-between p-4 rounded-lg hover:bg-theme-bg-secondary transition-colors">
      <div className="flex items-start space-x-3">
        <div className={`w-10 h-10 bg-gradient-to-r from-${color}-500 to-${color}-600 rounded-lg flex items-center justify-center mt-1`}>
          <Icon className="text-white w-5 h-5" />
        </div>
        <div>
          <h4 className="font-medium text-theme-text">{label}</h4>
          <p className="text-sm text-theme-text-secondary">{description}</p>
        </div>
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
          checked ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-theme-text mb-2">Settings</h1>
          <p className="text-theme-text-secondary">Manage your account settings and preferences</p>
        </div>

        {/* Appearance Settings */}
        <div className="card-modern p-6 mb-6">
          <h2 className="text-xl font-semibold text-theme-text mb-4 flex items-center">
            <FiSettings className="mr-2" />
            Appearance
          </h2>
          
          <div className="space-y-4">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between p-4 rounded-lg hover:bg-theme-bg-secondary transition-colors">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mt-1">
                  {theme === 'dark' ? <FiMoon className="text-white w-5 h-5" /> : <FiSun className="text-white w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-medium text-theme-text">Dark Mode</h4>
                  <p className="text-sm text-theme-text-secondary">
                    {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  theme === 'dark' ? 'bg-primary-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <SettingToggle
              label="Compact View"
              description="Display more content in less space"
              checked={settings.compactView}
              onChange={() => handleSettingChange('compactView')}
              icon={FiSettings}
              color="indigo"
            />

            <SettingToggle
              label="Auto Save"
              description="Automatically save your work as you type"
              checked={settings.autoSave}
              onChange={() => handleSettingChange('autoSave')}
              icon={FiCheck}
              color="green"
            />
          </div>
        </div>

        {/* Notification Settings */}
        <div className="card-modern p-6 mb-6">
          <h2 className="text-xl font-semibold text-theme-text mb-4 flex items-center">
            <FiBell className="mr-2" />
            Notifications
          </h2>
          
          <div className="space-y-4">
            <SettingToggle
              label="Email Notifications"
              description="Receive important updates via email"
              checked={settings.emailNotifications}
              onChange={() => handleSettingChange('emailNotifications')}
              icon={FiMail}
              color="blue"
            />

            <SettingToggle
              label="Push Notifications"
              description="Get notified instantly in your browser"
              checked={settings.pushNotifications}
              onChange={() => handleSettingChange('pushNotifications')}
              icon={FiBell}
              color="orange"
            />

            <SettingToggle
              label="Weekly Digest"
              description="Get a summary of your activity every week"
              checked={settings.weeklyDigest}
              onChange={() => handleSettingChange('weeklyDigest')}
              icon={FiMail}
              color="purple"
            />

            <SettingToggle
              label="Comment Notifications"
              description="Get notified when someone comments on your posts"
              checked={settings.commentNotifications}
              onChange={() => handleSettingChange('commentNotifications')}
              icon={FiBell}
              color="teal"
            />

            <SettingToggle
              label="Like Notifications"
              description="Get notified when someone likes your content"
              checked={settings.likeNotifications}
              onChange={() => handleSettingChange('likeNotifications')}
              icon={FiBell}
              color="pink"
            />

            <SettingToggle
              label="Marketing Emails"
              description="Receive promotional content and feature updates"
              checked={settings.marketingEmails}
              onChange={() => handleSettingChange('marketingEmails')}
              icon={FiMail}
              color="cyan"
            />
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="card-modern p-6 mb-6">
          <h2 className="text-xl font-semibold text-theme-text mb-4 flex items-center">
            <FiShield className="mr-2" />
            Privacy & Security
          </h2>
          
          <div className="space-y-4">
            <SettingToggle
              label="Public Profile"
              description="Make your profile visible to other users"
              checked={settings.publicProfile}
              onChange={() => handleSettingChange('publicProfile')}
              icon={FiGlobe}
              color="green"
            />

            <SettingToggle
              label="Show Email"
              description="Display your email address on your profile"
              checked={settings.showEmail}
              onChange={() => handleSettingChange('showEmail')}
              icon={FiMail}
              color="red"
            />

            <SettingToggle
              label="Show Online Status"
              description="Let others see when you're online"
              checked={settings.showOnlineStatus}
              onChange={() => handleSettingChange('showOnlineStatus')}
              icon={FiGlobe}
              color="blue"
            />

            <SettingToggle
              label="Two-Factor Authentication"
              description="Add an extra layer of security to your account"
              checked={settings.twoFactorAuth}
              onChange={() => handleSettingChange('twoFactorAuth')}
              icon={FiLock}
              color="yellow"
            />
          </div>
        </div>

        {/* Language & Region */}
        <div className="card-modern p-6 mb-6">
          <h2 className="text-xl font-semibold text-theme-text mb-4 flex items-center">
            <FiGlobe className="mr-2" />
            Language & Region
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-theme-text-secondary mb-2">
                Language
              </label>
              <select
                value={settings.language}
                onChange={(e) => handleSelectChange('language', e.target.value)}
                className="w-full px-4 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-theme-bg-secondary text-theme-text"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="it">Italiano</option>
                <option value="pt">Português</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-text-secondary mb-2">
                Timezone
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => handleSelectChange('timezone', e.target.value)}
                className="w-full px-4 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-theme-bg-secondary text-theme-text"
              >
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="EST">EST (Eastern Standard Time)</option>
                <option value="PST">PST (Pacific Standard Time)</option>
                <option value="GMT">GMT (Greenwich Mean Time)</option>
                <option value="CET">CET (Central European Time)</option>
                <option value="JST">JST (Japan Standard Time)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="card-modern p-6 mb-6">
          <h2 className="text-xl font-semibold text-theme-text mb-4 flex items-center">
            <FiDownload className="mr-2" />
            Data Management
          </h2>
          
          <div className="space-y-4">
            <button
              onClick={exportData}
              className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-theme-bg-secondary transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <FiDownload className="text-white w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-theme-text">Export Data</h4>
                  <p className="text-sm text-theme-text-secondary">Download a copy of your data</p>
                </div>
              </div>
              <FiDownload className="text-theme-text-secondary" />
            </button>

            <button
              onClick={importData}
              className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-theme-bg-secondary transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <FiUpload className="text-white w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-theme-text">Import Data</h4>
                  <p className="text-sm text-theme-text-secondary">Import data from another service</p>
                </div>
              </div>
              <FiUpload className="text-theme-text-secondary" />
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card-modern p-6 border-red-200 dark:border-red-800">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4 flex items-center">
            <FiTrash2 className="mr-2" />
            Danger Zone
          </h2>
          
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <FiInfo className="text-red-500 w-5 h-5 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Delete Account</h4>
                <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button
                  onClick={deleteAccount}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings