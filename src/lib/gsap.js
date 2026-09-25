import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP)

// Shared matchMedia conditions so every section respects the same rules.
export const MOTION_OK = '(prefers-reduced-motion: no-preference)'
export const DESKTOP = '(min-width: 1023px)' // matches the `laptop` breakpoint in index.css
export const FINE_POINTER = '(hover: hover) and (pointer: fine)'

export { gsap, ScrollTrigger, useGSAP }
