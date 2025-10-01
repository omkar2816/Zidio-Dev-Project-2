import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useTheme } from "../contexts/ThemeContext"
import { logout } from "../store/slices/authSlice"
import userService from "../services/userService"
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
  FiInfo,
  FiLoader
} from "react-icons/fi"
import toast from "react-hot-toast"

function Settings() {
  const { user } = useSelector((state) => state.auth)
  const { theme, toggleTheme } = useTheme()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [settingsLoading, setSettingsLoading] = useState(true)
  const [deletePassword, setDeletePassword] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      marketingEmails: false,
      weeklyDigest: true,
      commentNotifications: true,
      likeNotifications: false
    },
    privacy: {
      publicProfile: true,
      showEmail: false,
      showOnlineStatus: true,
      twoFactorAuth: false
    },
    preferences: {
      language: 'en',
      timezone: 'UTC',
      autoSave: true,
      compactView: false
    }
  })

  // Load user settings on component mount
  useEffect(() => {
    if (user?.token) {
      loadUserSettings()
    } else {
      setSettingsLoading(false)
    }
  }, [user])

  const loadUserSettings = async () => {
    try {
      setSettingsLoading(true)
      const response = await userService.getUserSettings(user.token)
      
      // Ensure the settings have the correct structure with defaults
      const loadedSettings = {
        notifications: {
          emailNotifications: true,
          pushNotifications: false,
          marketingEmails: false,
          weeklyDigest: true,
          commentNotifications: true,
          likeNotifications: false,
          ...response.settings?.notifications
        },
        privacy: {
          publicProfile: true,
          showEmail: false,
          showOnlineStatus: true,
          twoFactorAuth: false,
          ...response.settings?.privacy
        },
        preferences: {
          language: 'en',
          timezone: 'UTC',
          autoSave: true,
          compactView: false,
          ...response.settings?.preferences
        }
      }
      
      setSettings(loadedSettings)
    } catch (error) {
      console.error('Error loading settings:', error)
      toast.error('Failed to load settings')
      // Keep the default settings if loading fails
    } finally {
      setSettingsLoading(false)
    }
  }

  const handleSettingChange = async (category, setting) => {
    if (!settings || !settings[category]) {
      toast.error('Settings not loaded yet')
      return
    }
    
    try {
      setLoading(true)
      const newSettings = {
        ...settings,
        [category]: {
          ...settings[category],
          [setting]: !settings[category][setting]
        }
      }
      
      setSettings(newSettings)
      await userService.updateUserSettings(newSettings, user.token)
      toast.success("Setting updated successfully!")
    } catch (error) {
      console.error('Error updating setting:', error)
      toast.error(error.message || 'Failed to update setting')
      // Revert the change
      loadUserSettings()
    } finally {
      setLoading(false)
    }
  }

  const handleSelectChange = async (category, setting, value) => {
    if (!settings || !settings[category]) {
      toast.error('Settings not loaded yet')
      return
    }
    
    try {
      setLoading(true)
      const newSettings = {
        ...settings,
        [category]: {
          ...settings[category],
          [setting]: value
        }
      }
      
      setSettings(newSettings)
      await userService.updateUserSettings(newSettings, user.token)
      toast.success("Setting updated successfully!")
    } catch (error) {
      console.error('Error updating setting:', error)
      toast.error(error.message || 'Failed to update setting')
      // Revert the change
      loadUserSettings()
    } finally {
      setLoading(false)
    }
  }

  const exportData = async () => {
    try {
      setLoading(true)
      const { blob, filename } = await userService.exportUserData(user.token)
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast.success("Data exported successfully!")
    } catch (error) {
      console.error('Error exporting data:', error)
      toast.error(error.message || 'Failed to export data')
    } finally {
      setLoading(false)
    }
  }

  const importData = () => {
    toast.info("Feature coming soon!")
  }

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error("Please enter your password")
      return
    }

    try {
      setLoading(true)
      await userService.deleteUserAccount(deletePassword, user.token)
      toast.success("Account deleted successfully")
      dispatch(logout())
    } catch (error) {
      console.error('Error deleting account:', error)
      toast.error(error.message || 'Failed to delete account')
    } finally {
      setLoading(false)
      setShowDeleteConfirm(false)
      setDeletePassword('')
    }
  }

  const SettingToggle = ({ label, description, checked, onChange, icon: Icon, color = "blue", disabled = false }) => (
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
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
          checked ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {disabled ? (
          <div className="flex items-center justify-center w-full">
            <FiLoader className="w-3 h-3 animate-spin text-white" />
          </div>
        ) : (
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              checked ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        )}
      </button>
    </div>
  )

  // Early return if no user is authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-theme-text mb-2">Access Denied</h1>
          <p className="text-theme-text-secondary">Please log in to access settings.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-theme-text mb-2">Settings</h1>
          <p className="text-theme-text-secondary">Manage your account settings and preferences</p>
        </div>

        {settingsLoading ? (
          <div className="flex items-center justify-center py-12">
            <FiLoader className="w-8 h-8 animate-spin text-primary-500" />
            <span className="ml-2 text-theme-text-secondary">Loading settings...</span>
          </div>
        ) : (
          <>
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
                  checked={settings?.preferences?.compactView || false}
                  onChange={() => handleSettingChange('preferences', 'compactView')}
                  icon={FiSettings}
                  color="indigo"
                  disabled={loading}
                />

                <SettingToggle
                  label="Auto Save"
                  description="Automatically save your work as you type"
                  checked={settings?.preferences?.autoSave || false}
                  onChange={() => handleSettingChange('preferences', 'autoSave')}
                  icon={FiCheck}
                  color="green"
                  disabled={loading}
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
                  checked={settings?.notifications?.emailNotifications || false}
                  onChange={() => handleSettingChange('notifications', 'emailNotifications')}
                  icon={FiMail}
                  color="blue"
                  disabled={loading}
                />

                <SettingToggle
                  label="Push Notifications"
                  description="Get notified instantly in your browser"
                  checked={settings?.notifications?.pushNotifications || false}
                  onChange={() => handleSettingChange('notifications', 'pushNotifications')}
                  icon={FiBell}
                  color="orange"
                  disabled={loading}
                />

                <SettingToggle
                  label="Weekly Digest"
                  description="Get a summary of your activity every week"
                  checked={settings?.notifications?.weeklyDigest || false}
                  onChange={() => handleSettingChange('notifications', 'weeklyDigest')}
                  icon={FiMail}
                  color="purple"
                  disabled={loading}
                />

                <SettingToggle
                  label="Comment Notifications"
                  description="Get notified when someone comments on your posts"
                  checked={settings?.notifications?.commentNotifications || false}
                  onChange={() => handleSettingChange('notifications', 'commentNotifications')}
                  icon={FiBell}
                  color="teal"
                  disabled={loading}
                />

                <SettingToggle
                  label="Like Notifications"
                  description="Get notified when someone likes your content"
                  checked={settings?.notifications?.likeNotifications || false}
                  onChange={() => handleSettingChange('notifications', 'likeNotifications')}
                  icon={FiBell}
                  color="pink"
                  disabled={loading}
                />

                <SettingToggle
                  label="Marketing Emails"
                  description="Receive promotional content and feature updates"
                  checked={settings?.notifications?.marketingEmails || false}
                  onChange={() => handleSettingChange('notifications', 'marketingEmails')}
                  icon={FiMail}
                  color="cyan"
                  disabled={loading}
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
                  checked={settings?.privacy?.publicProfile || false}
                  onChange={() => handleSettingChange('privacy', 'publicProfile')}
                  icon={FiGlobe}
                  color="green"
                  disabled={loading}
                />

                <SettingToggle
                  label="Show Email"
                  description="Display your email address on your profile"
                  checked={settings?.privacy?.showEmail || false}
                  onChange={() => handleSettingChange('privacy', 'showEmail')}
                  icon={FiMail}
                  color="red"
                  disabled={loading}
                />

                <SettingToggle
                  label="Show Online Status"
                  description="Let others see when you're online"
                  checked={settings?.privacy?.showOnlineStatus || false}
                  onChange={() => handleSettingChange('privacy', 'showOnlineStatus')}
                  icon={FiGlobe}
                  color="blue"
                  disabled={loading}
                />

                <SettingToggle
                  label="Two-Factor Authentication"
                  description="Add an extra layer of security to your account"
                  checked={settings?.privacy?.twoFactorAuth || false}
                  onChange={() => handleSettingChange('privacy', 'twoFactorAuth')}
                  icon={FiLock}
                  color="yellow"
                  disabled={loading}
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
                    value={settings?.preferences?.language || 'en'}
                    onChange={(e) => handleSelectChange('preferences', 'language', e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-theme-bg-secondary text-theme-text disabled:opacity-50"
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
                    value={settings?.preferences?.timezone || 'UTC'}
                    onChange={(e) => handleSelectChange('preferences', 'timezone', e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-theme-bg-secondary text-theme-text disabled:opacity-50"
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
                  disabled={loading}
                  className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-theme-bg-secondary transition-colors text-left disabled:opacity-50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      {loading ? <FiLoader className="text-white w-5 h-5 animate-spin" /> : <FiDownload className="text-white w-5 h-5" />}
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
                  disabled={loading}
                  className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-theme-bg-secondary transition-colors text-left disabled:opacity-50"
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
                    
                    {!showDeleteConfirm ? (
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                      >
                        Delete Account
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <input
                          type="password"
                          placeholder="Enter your password to confirm"
                          value={deletePassword}
                          onChange={(e) => setDeletePassword(e.target.value)}
                          className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={handleDeleteAccount}
                            disabled={loading || !deletePassword}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center"
                          >
                            {loading ? <FiLoader className="w-4 h-4 animate-spin mr-2" /> : <FiTrash2 className="w-4 h-4 mr-2" />}
                            Confirm Delete
                          </button>
                          <button
                            onClick={() => {
                              setShowDeleteConfirm(false)
                              setDeletePassword('')
                            }}
                            disabled={loading}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Settings