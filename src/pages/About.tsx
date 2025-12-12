import { useTranslation } from 'react-i18next'

export const About = () => {
  const { t } = useTranslation()
  
  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{t('about.title')}</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            {t('about.description')}
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('about.features')}</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-6">
            <li>{t('about.feature1')}</li>
            <li>{t('about.feature2')}</li>
            <li>{t('about.feature3')}</li>
            <li>{t('about.feature4')}</li>
            <li>{t('about.feature5')}</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('about.technologyStack')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">{t('about.frontend')}</h3>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>React 19</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>React Router DOM</li>
              </ul>
            </div>
            <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">{t('about.stateManagement')}</h3>
              <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                <li>Zustand</li>
                <li>Custom Hooks</li>
                <li>Mock API Services</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
