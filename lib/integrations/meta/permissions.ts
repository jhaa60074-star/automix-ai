export const META_PERMISSIONS = [
  'instagram_basic',
  'pages_show_list',
  'pages_read_engagement',
  'instagram_manage_messages',
  'instagram_manage_comments',
  'instagram_manage_insights'
];

export const getScopesString = () => META_PERMISSIONS.join(',');
