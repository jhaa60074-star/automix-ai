export const automationsData = [
  {
    id: 'instagram',
    slug: 'instagram',
    title: 'Instagram Automation',
    icon: '📸',
    category: 'Social Media',
    shortDescription: 'Auto DM replies, Comment-to-DM, keyword triggers, and custom message workflows.',
    description: 'Automate your Instagram presence. Instantly reply to comments, send DMs triggered by specific keywords, and deliver lead magnets or links without lifting a finger.',
    whoItsFor: 'Creators, influencers, brands, and e-commerce stores.',
    useCases: [
      'Customer questions and FAQs in DMs',
      'Sending a PDF or Link when someone comments a keyword',
      'Automated welcome messages to new followers (where supported)'
    ],
    howItWorks: 'Connect your Instagram Professional account. Set up visual rules (e.g., "If comment contains \'LINK\', send DM with link"). The AI executes this instantly 24/7.',
    status: 'Setup Required',
    helpLink: '/help/instagram'
  },
  {
    id: 'whatsapp',
    slug: 'whatsapp',
    title: 'WhatsApp Automation',
    icon: '💬',
    category: 'Messaging',
    shortDescription: 'AI customer support replies, product inquiries, and seamless business workflows.',
    description: 'Transform your WhatsApp Business number into a 24/7 intelligent agent. Resolve customer queries, provide order updates, and capture leads automatically.',
    whoItsFor: 'Local businesses, e-commerce, and support teams.',
    useCases: [
      'AI-powered FAQs and triage',
      'Automated product catalogs and inquiry handling',
      'Order status notifications'
    ],
    howItWorks: 'Connect via the WhatsApp Business API. Map user intents to AI responses or rule-based workflows.',
    status: 'Setup Required',
    helpLink: '/help/whatsapp'
  },
  {
    id: 'gmail',
    slug: 'gmail',
    title: 'Gmail Automation',
    icon: '📧',
    category: 'Email',
    shortDescription: 'AI-assisted email replies, categorization, smart summaries, and notifications.',
    description: 'Tame your inbox with intelligent workflows. Automatically draft replies to common questions, categorize incoming leads, and trigger other actions based on email contents.',
    whoItsFor: 'Executives, sales teams, and customer support.',
    useCases: [
      'Drafting AI replies to customer inquiries',
      'Extracting invoice details from attachments',
      'Categorizing emails into specific labels automatically'
    ],
    howItWorks: 'Authenticate your Google account. Define triggers (e.g., "New email in Inbox") and actions (e.g., "Generate AI reply and save as draft").',
    status: 'Setup Required',
    helpLink: '/help/gmail'
  },
  {
    id: 'telegram',
    slug: 'telegram',
    title: 'Telegram Automation',
    icon: '✈️',
    category: 'Messaging',
    shortDescription: 'Advanced bot automation, smart AI replies, and custom channel workflows.',
    description: 'Build powerful Telegram bots without coding. Automate group moderation, handle direct user queries with AI, and broadcast dynamic content to channels.',
    whoItsFor: 'Community managers, crypto projects, and marketers.',
    useCases: [
      'Automated group moderation and FAQ',
      'AI assistant bot for customer interactions',
      'Automated content broadcasting'
    ],
    howItWorks: 'Provide your Telegram Bot Token from BotFather. Construct rule-based or AI-driven conversational flows.',
    status: 'Setup Required',
    helpLink: '/help/telegram'
  },
  {
    id: 'shopify',
    slug: 'shopify',
    title: 'Shopify Automation',
    icon: '🛍️',
    category: 'E-commerce',
    shortDescription: 'Automate order updates, product workflows, and personalized customer interactions.',
    description: 'Connect your storefront to automate the heavy lifting. Sync orders, update inventory based on triggers, and orchestrate customer retention workflows.',
    whoItsFor: 'Shopify merchants and e-commerce managers.',
    useCases: [
      'Syncing new orders to Google Sheets',
      'Triggering WhatsApp/Email notifications on order fulfillment',
      'Generating AI product descriptions in bulk'
    ],
    howItWorks: 'Install the custom app or provide API credentials. Map Shopify webhooks (e.g., Order Created) to downstream actions.',
    status: 'Setup Required',
    helpLink: '/help/shopify'
  },
  {
    id: 'google-sheets',
    slug: 'google-sheets',
    title: 'Google Sheets',
    icon: '📊',
    category: 'Data',
    shortDescription: 'Read data, write data, generate reports, and automate data workflows.',
    description: 'Use Google Sheets as your dynamic database. Automatically append rows from other apps, or use Sheets data to trigger emails and messages.',
    whoItsFor: 'Operations teams, marketers, and data analysts.',
    useCases: [
      'Saving new leads from Instagram to a Sheet',
      'Sending weekly email reports based on Sheet data',
      'Using Sheet data to personalize automated messages'
    ],
    howItWorks: 'Connect your Google account. Select a Spreadsheet and Worksheet, then map the columns to your workflow data.',
    status: 'Setup Required',
    helpLink: '/help/google-sheets'
  },
  {
    id: 'google-drive',
    slug: 'google-drive',
    title: 'Google Drive',
    icon: '📁',
    category: 'Files',
    shortDescription: 'File workflows, intelligent file processing, and automated organization.',
    description: 'Automate document management. Automatically save email attachments, generate PDFs and upload them, or trigger AI analysis when a new file is added.',
    whoItsFor: 'Administrators, legal teams, and project managers.',
    useCases: [
      'Auto-saving generated reports to specific folders',
      'Triggering an AI summary when a new PDF is uploaded',
      'Organizing files based on naming conventions'
    ],
    howItWorks: 'Connect Google Drive. Set triggers for specific folders, or use Drive as a destination action in other workflows.',
    status: 'Setup Required',
    helpLink: '/help/google-drive'
  },
  {
    id: 'google-calendar',
    slug: 'google-calendar',
    title: 'Google Calendar',
    icon: '📅',
    category: 'Scheduling',
    shortDescription: 'Scheduling workflows, automated event creation, and reminders.',
    description: 'Streamline your scheduling. Automatically create events from chat messages, send pre-meeting reminders via WhatsApp, and manage your availability.',
    whoItsFor: 'Consultants, sales teams, and service professionals.',
    useCases: [
      'Creating calendar events from email text',
      'Sending WhatsApp reminders 1 hour before an event',
      'Logging completed meetings to a Google Sheet'
    ],
    howItWorks: 'Connect Google Calendar. Map event details (Title, Time, Attendees) from upstream triggers in your automation flow.',
    status: 'Setup Required',
    helpLink: '/help/google-calendar'
  },
  {
    id: 'website',
    slug: 'website',
    title: 'Website Automation',
    icon: '🌐',
    category: 'Web',
    shortDescription: 'AI Chat Widget, Form Capture, and Webhook integrations.',
    description: 'Connect your website to capture leads directly into your database. Deploy an AI chat widget to answer visitor questions 24/7.',
    whoItsFor: 'Marketers, Agencies, and E-commerce brands.',
    useCases: [
      'Capturing leads from embedded forms',
      'Deploying an AI assistant on your homepage',
      'Triggering webhooks on specific page visits'
    ],
    howItWorks: 'Add a simple script tag to your website (WordPress, Shopify, Webflow, or plain HTML) to enable widgets and tracking.',
    status: 'Setup Required',
    helpLink: '/help/website'
  }
];
