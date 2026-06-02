export const COPY = {
  // Hero
  'hero.headline':    'Identify any font. Understand every curve.',
  'hero.subheading':  'Drop a screenshot. We\'ll do the autopsy — anatomy, alternatives, and pairings in under five seconds.',

  // Upload
  'upload.idle.primary':            'Drop a screenshot here',
  'upload.idle.secondary':          'or click to browse · paste with ⌘V',
  'upload.idle.button':             'Browse',
  'upload.uploading':               'Uploading… {progress}%',
  'upload.region.caption':          'DRAG TO SELECT TEXT REGION (OPTIONAL)',
  'upload.action.reset':            'Reset',
  'upload.action.analyze':          'Analyze',
  'upload.error.tooLarge':          'Image must be under 5MB.',
  'upload.error.unsupportedFormat': 'Only JPG, PNG, or WebP images are supported.',
  'upload.error.uploadFailed':      'Upload failed. Please try again.',

  // Loading
  'loading.title':         'Analyzing your image…',
  'loading.stage.upload':  'UPLOAD',
  'loading.stage.ocr':     'OCR',
  'loading.stage.match':   'MATCH',
  'loading.stage.render':  'RENDER',

  // Result
  'result.eyebrow':              'FONT IDENTIFIED',
  'result.confidence.high':      'HIGH CONFIDENCE',
  'result.confidence.medium':    'MEDIUM CONFIDENCE',
  'result.confidence.low':       'LOW CONFIDENCE',
  'result.back':                 '← New Analysis',
  'result.meta.designer':        'DESIGNER',
  'result.meta.category':        'CATEGORY',
  'result.meta.license':         'LICENSE',
  'result.meta.weights':         'WEIGHTS',
  'result.anatomy.heading':          'ANATOMY',
  'result.anatomy.tab.withOverlay':  'With Anatomy',
  'result.anatomy.tab.clean':        'Clean View',
  'result.tester.placeholder':   'Type to test all fonts…',
  'result.tester.sizeLabel':     'SIZE',
  'result.alternatives.heading':    'Free Alternatives',
  'result.alternatives.subheading': 'From the Google Fonts library, free for commercial use.',
  'result.pairings.heading':    'Pairs Well With',
  'result.share.download':      'Download PNG',
  'result.share.copy':          'Copy Link',
  'result.share.copied':        'Link copied ✓',
  'result.share.downloaded':    'Card downloaded ✓',

  // Copy CSS
  'copyCss.default': 'Copy CSS',
  'copyCss.copied':  'Copied',

  // Errors
  'error.noText.title':        'No text detected',
  'error.noText.message':      'We couldn\'t read any text in this image. Try a sharper screenshot, or type the text manually below:',
  'error.noText.manualSubmit': 'Analyze Manually',
  'error.rateLimit.title':     'Monthly capacity reached',
  'error.rateLimit.message':   'Fontopsy is on a free plan and has hit its monthly limit. The service resumes on {resetDate}.',
  'error.rateLimit.action':    'Back to Home',
  'error.generic.title':       'Something went wrong',
  'error.generic.message':     'Please try again in a moment.',
  'error.generic.action':      'Retry',
  'error.notFound.title':      'Result not found',
  'error.notFound.message':    'This analysis has expired or wasn\'t found. Upload an image to begin.',
  'error.notFound.action':     'Upload Image',

  // Recent
  'recent.heading': 'Recent',

  // Footer
  'footer.credits': 'Made with ☕ + 🔬',
  'footer.about':   'About',
  'footer.github':  'GitHub',
} as const;

export type CopyKey = keyof typeof COPY;