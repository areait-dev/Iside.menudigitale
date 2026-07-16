import localFont from 'next/font/local'

export const montserrat = localFont({
  src: [
    { path: '../../public/lib/font-family/Gotham-Thin.otf', weight: '100', style: 'normal' },
    { path: '../../public/lib/font-family/Gotham-ThinItalic.otf', weight: '100', style: 'italic' },
    { path: '../../public/lib/font-family/Gotham-XLight.otf', weight: '200', style: 'normal' },
    { path: '../../public/lib/font-family/Gotham-XLightItalic.otf', weight: '200', style: 'italic' },
    { path: '../../public/lib/font-family/GothamLight.ttf', weight: '300', style: 'normal' },
    { path: '../../public/lib/font-family/GothamLightItalic.ttf', weight: '300', style: 'italic' },
    { path: '../../public/lib/font-family/GothamBook.ttf', weight: '400', style: 'normal' },
    { path: '../../public/lib/font-family/GothamBookItalic.ttf', weight: '400', style: 'italic' },
    { path: '../../public/lib/font-family/GothamMedium.ttf', weight: '500', style: 'normal' },
    { path: '../../public/lib/font-family/GothamBold.ttf', weight: '700', style: 'normal' },
    { path: '../../public/lib/font-family/GothamBoldItalic.ttf', weight: '700', style: 'italic' },
    { path: '../../public/lib/font-family/Gotham-Black.otf', weight: '900', style: 'normal' },
  ],
  display: 'swap',
})
