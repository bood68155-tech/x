import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'

/**
 * Brand colours, SVG viewBox data, and glow configuration per tech.
 * Each icon renders a large inline SVG instead of emoji.
 */
const BRAND_DATA = {
  HTML5: {
    color: '#E34F26',
    glow: '0 0 30px rgba(227,79,38,0.5), 0 0 60px rgba(227,79,38,0.2)',
    glowHover: '0 0 40px rgba(227,79,38,0.7), 0 0 80px rgba(227,79,38,0.3)',
    svg: (
      <svg viewBox="0 0 128 128" className="w-10 h-10 sm:w-12 sm:h-12">
        <path fill="#E44D26" d="M19.037 113.876L9.032 1.661h109.936l-10.016 112.198-44.989 12.48z"/>
        <path fill="#F16529" d="M64 116.8l-.014-12.011 35.758-9.887 10.318-115.128H64.011zM64.009 75.692l-.011 14.825 29.741-8.247 5.994-67.086H64.011z"/>
        <path fill="#EBEBEB" d="M64 52.526v37.556l-29.741 8.238-4.241-47.579zM64 5.086V52.52l-35.723-.019 1.005-11.314z"/>
        <path fill="#fff" d="M64 52.526L35.18 95.169l-3.692-41.383-.379-4.531H64zM64 5.086v42.56l20.564.16 2.082-23.37z"/>
        <path fill="#EBEBEB" d="M86.066 5.086L64 52.526l10.247.012 20.564-.16.255-47.292zM64 116.8l35.729-9.969.723-8.123.528-13.321-37.006-.387z"/>
        <path fill="#fff" d="M64 116.8v-20.944l-.075.005-35.016-9.74-2.241-24.961L64 52.526v64.274z"/>
        <path fill="#fff" d="M64 75.734v41.059l30.717-8.625 6.534-73.1.271-3.012L64 75.734z"/>
        <path fill="#fff" d="M64 43.286V5.086H34.379L64 43.286z"/>
        <path fill="#fff" d="M64 43.286l-29.821 47.847-.453-5.065-.379-4.531.009-.112L64 43.286z"/>
        <path fill="#fff" d="M64 75.734l-29.814 29.425-1.48-16.527-.279-3.098L64 75.734z"/>
      </svg>
    ),
  },
  CSS3: {
    color: '#1572B6',
    glow: '0 0 30px rgba(21,114,182,0.5), 0 0 60px rgba(21,114,182,0.2)',
    glowHover: '0 0 40px rgba(21,114,182,0.7), 0 0 80px rgba(21,114,182,0.3)',
    svg: (
      <svg viewBox="0 0 128 128" className="w-10 h-10 sm:w-12 sm:h-12">
        <path fill="#1572B6" d="M19.037 113.876L9.032 1.661h109.936l-10.016 112.198-44.989 12.48z"/>
        <path fill="#33A9DC" d="M64 116.8l-.014-12.011 35.758-9.887 10.318-115.128H64.011z"/>
        <path fill="#fff" d="M64 52.526v37.556l-29.741 8.238-4.241-47.579zM64 5.086V52.52l-35.723-.019 1.005-11.314z"/>
        <path fill="#EBEBEB" d="M64 52.526L35.18 95.169l-3.692-41.383-.379-4.531H64zM64 5.086v42.56l20.564.16 2.082-23.37z"/>
        <path fill="#fff" d="M86.066 5.086L64 52.526l10.247.012 20.564-.16.255-47.292zM64 116.8l35.729-9.969.723-8.123.528-13.321-37.006-.387z"/>
        <path fill="#EBEBEB" d="M64 116.8v-20.944l-.075.005-35.016-9.74-2.241-24.961L64 52.526v64.274z"/>
        <path fill="#fff" d="M64 75.734v41.059l30.717-8.625 6.534-73.1.271-3.012L64 75.734z"/>
      </svg>
    ),
  },
  JavaScript: {
    color: '#F7DF1E',
    glow: '0 0 30px rgba(247,223,30,0.5), 0 0 60px rgba(247,223,30,0.2)',
    glowHover: '0 0 40px rgba(247,223,30,0.7), 0 0 80px rgba(247,223,30,0.3)',
    svg: (
      <svg viewBox="0 0 128 128" className="w-10 h-10 sm:w-12 sm:h-12">
        <path fill="#F0DB4F" d="M1.408 128.134v-48.293H17.82v48.293zm0-110.168V0H128v17.966zm0 0"/>
        <path fill="#101EF3" d="M106.498 94.111c-1.437 0-2.613-1.176-2.613-2.613V67.035c0-3.559-2.893-6.452-6.452-6.452H74.504v18.191h19.398c.889 0 1.611.722 1.611 1.611v20.776c0 .889-.722 1.611-1.611 1.611zM48.007 104.176H18.95c-.889 0-1.611-.722-1.611-1.611V67.035c0-.889.722-1.611 1.611-1.611h29.058c.889 0 1.611.722 1.611 1.611v35.53c0 .889-.722 1.611-1.611 1.611zm-29.058-51.68c-.889 0-1.611-.722-1.611-1.611V35.354c0-.889.722-1.611 1.611-1.611h29.058c.889 0 1.611.722 1.611 1.611v15.531c0 .889-.722 1.611-1.611 1.611z"/>
      </svg>
    ),
  },
  React: {
    color: '#61DAFB',
    glow: '0 0 30px rgba(97,218,251,0.5), 0 0 60px rgba(97,218,251,0.2)',
    glowHover: '0 0 40px rgba(97,218,251,0.7), 0 0 80px rgba(97,218,251,0.3)',
    svg: (
      <svg viewBox="0 0 128 128" className="w-10 h-10 sm:w-12 sm:h-12">
        <g fill="#61DAFB">
          <circle cx="64" cy="64" r="11.4"/>
          <ellipse cx="64" cy="64" rx="57" ry="22.2" fill="none" stroke="#61DAFB" strokeWidth="3"/>
          <ellipse cx="64" cy="64" rx="57" ry="22.2" fill="none" stroke="#61DAFB" strokeWidth="3" transform="rotate(60 64 64)"/>
          <ellipse cx="64" cy="64" rx="57" ry="22.2" fill="none" stroke="#61DAFB" strokeWidth="3" transform="rotate(120 64 64)"/>
        </g>
      </svg>
    ),
  },
  'Tailwind CSS': {
    color: '#38BDF8',
    glow: '0 0 30px rgba(56,189,248,0.5), 0 0 60px rgba(56,189,248,0.2)',
    glowHover: '0 0 40px rgba(56,189,248,0.7), 0 0 80px rgba(56,189,248,0.3)',
    svg: (
      <svg viewBox="0 0 128 128" className="w-10 h-10 sm:w-12 sm:h-12">
        <path fill="#38BDF8" d="M64 27.2c-17.6 0-28.8 8.8-33.6 26.4 6.7-8.8 14.4-12 23.2-9.6 5 1.4 8.6 4.8 12.6 8.4 6.4 6 13.6 12.8 29.6 12.8 17.6 0 28.8-8.8 33.6-26.4-6.7 8.8-14.4 12-23.2 9.6-5-1.4-8.6-4.8-12.6-8.4-6.4-6-13.6-12.8-29.6-12.8zM30.4 64.8c-17.6 0-28.8 8.8-33.6 26.4 6.7-8.8 14.4-12 23.2-9.6 5 1.4 8.6 4.8 12.6 8.4 6.4 6 13.6 12.8 29.6 12.8 17.6 0 28.8-8.8 33.6-26.4-6.7 8.8-14.4 12-23.2 9.6-5-1.4-8.6-4.8-12.6-8.4-6.4-6-13.6-12.8-29.6-12.8z"/>
      </svg>
    ),
  },
  'Node.js': {
    color: '#68A063',
    glow: '0 0 30px rgba(104,160,99,0.5), 0 0 60px rgba(104,160,99,0.2)',
    glowHover: '0 0 40px rgba(104,160,99,0.7), 0 0 80px rgba(104,160,99,0.3)',
    svg: (
      <svg viewBox="0 0 128 128" className="w-10 h-10 sm:w-12 sm:h-12">
        <path fill="#68A063" d="M112.771 30.244L68.954 4.748c-2.664-1.56-5.936-1.537-8.571.001L15.345 30.244C12.69 31.772 11 34.634 11 37.72v50.698c0 3.123 1.726 6.009 4.371 7.512l45.078 25.337c2.624 1.484 5.756 1.512 8.4.025l44.946-25.412c2.64-1.486 4.361-4.373 4.361-7.491V37.72c.002-3.086-1.712-5.95-4.385-7.476z"/>
        <path fill="#3C873A" d="M93.348 54.02L64.587 70.395c-.01.006-.02.016-.03.022-.01.006-.02.013-.03.02l-.02.012c-.01.005-.016.01-.025.013L43.6 82.552c-.057.03-.114.055-.175.075v-.002a.96.96 0 01-.355.075H32.63c-.124 0-.246-.022-.362-.063a.975.975 0 01-.334-.2V53.842c0-.026.008-.048.01-.073.006-.077.026-.147.056-.213.004-.007.005-.014.01-.02l19.593-11.356c.01-.005.022-.01.032-.013a.952.952 0 01.276-.067h11.336c.12 0 .237.022.35.062.014.005.026.014.04.02l27.673 16.076c.096.055.168.13.216.216.008.015.015.028.02.044a.95.95 0 01.064.276v23.423a.97.97 0 01-.032.218z"/>
        <path fill="#fff" d="M53.818 54.965v20.462c0 .154.082.28.205.35l10.238 5.911c.113.065.248.065.361 0l10.238-5.911c.123-.07.205-.196.205-.35v-20.462c0-.154-.082-.28-.205-.35l-10.238-5.911a.414.414 0 00-.361 0l-10.238 5.911c-.123.07-.205.196-.205.35z"/>
      </svg>
    ),
  },
  Supabase: {
    color: '#3ECF8E',
    glow: '0 0 30px rgba(62,207,142,0.5), 0 0 60px rgba(62,207,142,0.2)',
    glowHover: '0 0 40px rgba(62,207,142,0.7), 0 0 80px rgba(62,207,142,0.3)',
    svg: (
      <svg viewBox="0 0 109 113" className="w-10 h-10 sm:w-12 sm:h-12">
        <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" fill="url(#paint0_linear)"/>
        <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" fill="url(#paint1_linear)" fillOpacity="0.2"/>
        <path d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.041L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z" fill="#3ECF8E"/>
        <defs>
          <linearGradient id="paint0_linear" x1="53.9738" y1="54.974" x2="94.1635" y2="71.8295" gradientUnits="userSpaceOnUse">
            <stop stopColor="#249361"/>
            <stop offset="1" stopColor="#3ECF8E"/>
          </linearGradient>
          <linearGradient id="paint1_linear" x1="36.1558" y1="30.578" x2="54.4844" y2="65.0806" gradientUnits="userSpaceOnUse">
            <stop/>
            <stop offset="1" stopOpacity="0"/>
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  Firebase: {
    color: '#FFCA28',
    glow: '0 0 30px rgba(255,202,40,0.5), 0 0 60px rgba(255,202,40,0.2)',
    glowHover: '0 0 40px rgba(255,202,40,0.7), 0 0 80px rgba(255,202,40,0.3)',
    svg: (
      <svg viewBox="0 0 128 128" className="w-10 h-10 sm:w-12 sm:h-12">
        <path fill="#FFCA28" d="M32 95.027l15.703-61.73L84.52 95.027z"/>
        <path fill="#FF8F00" d="M32 95.027l15.703-61.73L84.52 95.027H32z"/>
        <path fill="#F44336" d="M71.394 26.913L53.149 6.348 26.241 26.913z"/>
        <path fill="#FFCA28" d="M26.241 95.027L32 95.027l15.703-61.73z"/>
        <path fill="#4CAF50" d="M90.542 115.756L71.394 26.913 53.149 95.027z"/>
        <path fill="#2196F3" d="M53.149 95.027l18.245-68.114 19.148 88.843z"/>
      </svg>
    ),
  },
  MySQL: {
    color: '#4479A1',
    glow: '0 0 30px rgba(68,121,161,0.5), 0 0 60px rgba(68,121,161,0.2)',
    glowHover: '0 0 40px rgba(68,121,161,0.7), 0 0 80px rgba(68,121,161,0.3)',
    svg: (
      <svg viewBox="0 0 128 128" className="w-10 h-10 sm:w-12 sm:h-12">
        <path fill="#00758F" d="M87.578 113.449c-1.215.364-2.447.632-3.693.799a64.087 64.087 0 01-7.837.661c-1.505.027-3.005.028-4.497-.003a58.444 58.444 0 01-7.248-.889 49.075 49.075 0 01-5.864-1.665c-.695-.273-1.383-.567-2.064-.879a35.303 35.303 0 01-3.628-1.952c-.353-.224-.699-.46-1.041-.704a34.757 34.757 0 01-5.203-4.445A34.188 34.188 0 0123.255 85.69c-.948-1.409-1.697-2.924-2.31-4.51-.232-.601-.44-1.211-.623-1.827a34.442 34.442 0 01-1.282-5.731c-.102-.951-.152-1.91-.146-2.866.009-1.276.07-2.554.193-3.827.183-1.886.474-3.76.894-5.605.285-1.255.627-2.495 1.028-3.715a35.177 35.177 0 015.383-11.202c.972-1.418 2.043-2.752 3.222-3.983a34.46 34.46 0 015.374-4.578c1.21-.785 2.495-1.434 3.844-1.938.838-.314 1.7-.565 2.584-.743a34.34 34.34 0 015.259-.626c1.075-.02 2.152.02 3.229.096 2.15.153 4.294.493 6.407 1.031.812.205 1.617.447 2.413.723a34.62 34.62 0 0110.078 5.284c1.127.78 2.2 1.628 3.2 2.555a34.587 34.587 0 016.434 8.207c.653.993 1.25 2.025 1.78 3.098.364.735.694 1.491.984 2.262a34.31 34.31 0 012.323 8.617c.138 1.42.165 2.854.073 4.282-.118 1.81-.428 3.608-.92 5.364a35.04 35.04 0 01-5.186 11.176c-.868 1.258-1.83 2.428-2.884 3.496a34.734 34.734 0 01-5.14 4.268c-.689.424-1.401.811-2.133 1.156a34.348 34.348 0 01-5.52 2.087c-1.287.34-2.596.575-3.922.697-1.362.125-2.733.141-4.103.043a34.476 34.476 0 01-3.844-.505z"/>
        <path fill="#FFF" d="M104.629 57.129c-1.366-1.78-3.27-3.085-5.542-3.852l-.296-.096c-2.034-.666-4.212-.89-6.386-.835-1.882.047-3.739.303-5.524.808l-.257.074c-1.848.541-3.553 1.392-5.032 2.502l-.148.113c-1.721 1.317-3.094 2.997-4.014 4.944-.087.184-.171.37-.252.558-.574 1.333-.942 2.744-1.091 4.194-.105 1.018-.119 2.045-.035 3.064.138 1.675.503 3.32 1.086 4.882.446 1.192 1.047 2.333 1.792 3.392.774 1.092 1.688 2.091 2.723 2.976l.14.118c1.456 1.196 3.206 1.991 5.107 2.289l.296.046c1.787.278 3.618.184 5.384-.256.827-.205 1.633-.486 2.405-.845l.214-.1c1.692-.813 3.153-1.966 4.266-3.377.659-.837 1.218-1.752 1.657-2.734.371-.829.65-1.702.828-2.598.148-.749.22-1.511.211-2.274-.014-1.188-.216-2.367-.597-3.493-.467-1.372-1.202-2.635-2.163-3.696-.782-.862-1.703-1.588-2.724-2.145z"/>
      </svg>
    ),
  },
  n8n: {
    color: '#EA4B71',
    glow: '0 0 30px rgba(234,75,113,0.5), 0 0 60px rgba(234,75,113,0.2)',
    glowHover: '0 0 40px rgba(234,75,113,0.7), 0 0 80px rgba(234,75,113,0.3)',
    svg: (
      <svg viewBox="0 0 128 128" className="w-10 h-10 sm:w-12 sm:h-12">
        <rect width="128" height="128" rx="24" fill="#EA4B71"/>
        <path fill="#fff" d="M36 50h56v8H36zm0 20h56v8H36zm0 20h36v8H36z"/>
      </svg>
    ),
  },
  'Make.com': {
    color: '#6D28D9',
    glow: '0 0 30px rgba(109,40,217,0.5), 0 0 60px rgba(109,40,217,0.2)',
    glowHover: '0 0 40px rgba(109,40,217,0.7), 0 0 80px rgba(109,40,217,0.3)',
    svg: (
      <svg viewBox="0 0 128 128" className="w-10 h-10 sm:w-12 sm:h-12">
        <rect width="128" height="128" rx="24" fill="#6D28D9"/>
        <path fill="#fff" d="M42 44l22 20-22 20h10l22-20-22-20zm24 0l22 20-22 20h10l22-20-22-20z"/>
      </svg>
    ),
  },
  GitHub: {
    color: '#FFFFFF',
    glow: '0 0 30px rgba(255,255,255,0.3), 0 0 60px rgba(255,255,255,0.1)',
    glowHover: '0 0 40px rgba(255,255,255,0.5), 0 0 80px rgba(255,255,255,0.2)',
    svg: (
      <svg viewBox="0 0 128 128" className="w-10 h-10 sm:w-12 sm:h-12">
        <path fill="#fff" d="M64 0C28.65 0 0 28.65 0 64c0 28.28 18.34 52.24 43.77 60.71 3.18.59 4.34-1.38 4.34-3.07 0-1.51-.05-5.46-.08-10.72-17.82 3.23-21.58-8.58-21.58-8.58-2.91-7.4-7.11-9.37-7.11-9.37-5.81-3.97.44-3.89.44-3.89 6.42.45 9.8 6.6 9.8 6.6 5.71 9.8 14.99 6.96 18.65 5.32.58-4.14 2.24-6.97 4.07-8.57-14.23-1.62-29.19-7.12-29.19-31.71 0-7.01 2.5-12.74 6.6-17.22-.66-1.62-2.87-8.13.63-16.95 0 0 5.38-1.72 17.6 6.59A61.36 61.36 0 0164 20.72c5.44.01 10.93.73 16.03 2.15 12.21-8.31 17.58-6.59 17.58-6.59 3.51 8.82 1.3 15.33.64 16.95 4.11 4.48 6.6 10.21 6.6 17.22 0 24.66-14.99 30.1-29.27 31.69 2.3 1.99 4.35 5.92 4.35 11.93 0 8.61-.08 15.54-.08 17.66 0 1.7 1.15 3.68 4.38 3.06C109.7 116.22 128 92.26 128 64 128 28.65 99.35 0 64 0z"/>
      </svg>
    ),
  },
  Vercel: {
    color: '#FFFFFF',
    glow: '0 0 30px rgba(255,255,255,0.3), 0 0 60px rgba(255,255,255,0.1)',
    glowHover: '0 0 40px rgba(255,255,255,0.5), 0 0 80px rgba(255,255,255,0.2)',
    svg: (
      <svg viewBox="0 0 128 128" className="w-10 h-10 sm:w-12 sm:h-12">
        <path fill="#fff" d="M64 0L128 112H0z"/>
      </svg>
    ),
  },
  'VS Code': {
    color: '#007ACC',
    glow: '0 0 30px rgba(0,122,204,0.5), 0 0 60px rgba(0,122,204,0.2)',
    glowHover: '0 0 40px rgba(0,122,204,0.7), 0 0 80px rgba(0,122,204,0.3)',
    svg: (
      <svg viewBox="0 0 128 128" className="w-10 h-10 sm:w-12 sm:h-12">
        <path fill="#007ACC" d="M87.95 28.5L42.1 6.15a5.8 5.8 0 00-5.75.2L5.75 24.55a5.78 5.78 0 00-2.9 5.05v68.8a5.78 5.78 0 002.9 5.05L36.35 121.85a5.8 5.8 0 005.75.2L87.95 99.5a5.78 5.78 0 002.9-5.05V33.55a5.78 5.78 0 00-2.9-5.05z"/>
        <path fill="#fff" d="M87.95 28.5L36.35 121.85l51.6-93.35z"/>
        <path fill="#fff" d="M87.95 99.5L36.35 6.15v122.4z"/>
        <path fill="#1F9CF0" d="M54.65 81.75L36.35 121.85l51.6-22.35z"/>
        <path fill="#1F9CF0" d="M54.65 46.25L36.35 6.15l51.6 22.35z"/>
      </svg>
    ),
  },
  'Golden Asseal': {
    color: '#F59E0B',
    glow: '0 0 30px rgba(245,158,11,0.5), 0 0 60px rgba(245,158,11,0.2)',
    glowHover: '0 0 40px rgba(245,158,11,0.7), 0 0 80px rgba(245,158,11,0.3)',
    svg: (
      <svg viewBox="0 0 128 128" className="w-10 h-10 sm:w-12 sm:h-12">
        <rect width="128" height="128" rx="24" fill="#F59E0B"/>
        <text x="64" y="78" textAnchor="middle" fontSize="48" fontWeight="bold" fill="#fff" fontFamily="sans-serif">G</text>
      </svg>
    ),
  },
  'E-Commerce': {
    color: '#10B981',
    glow: '0 0 30px rgba(16,185,129,0.5), 0 0 60px rgba(16,185,129,0.2)',
    glowHover: '0 0 40px rgba(16,185,129,0.7), 0 0 80px rgba(16,185,129,0.3)',
    svg: (
      <svg viewBox="0 0 128 128" className="w-10 h-10 sm:w-12 sm:h-12">
        <rect width="128" height="128" rx="24" fill="#10B981"/>
        <path fill="#fff" d="M30 35h12l14 55h52l12-38H50" strokeLinecap="round" strokeLinejoin="round" stroke="#fff" strokeWidth="5" fill="none"/>
        <circle cx="55" cy="100" r="5" fill="#fff"/>
        <circle cx="95" cy="100" r="5" fill="#fff"/>
      </svg>
    ),
  },
  Accounting: {
    color: '#8B5CF6',
    glow: '0 0 30px rgba(139,92,246,0.5), 0 0 60px rgba(139,92,246,0.2)',
    glowHover: '0 0 40px rgba(139,92,246,0.7), 0 0 80px rgba(139,92,246,0.3)',
    svg: (
      <svg viewBox="0 0 128 128" className="w-10 h-10 sm:w-12 sm:h-12">
        <rect width="128" height="128" rx="24" fill="#8B5CF6"/>
        <text x="64" y="78" textAnchor="middle" fontSize="42" fontWeight="bold" fill="#fff" fontFamily="sans-serif">$</text>
      </svg>
    ),
  },
  'Digital Marketing': {
    color: '#F472B6',
    glow: '0 0 30px rgba(244,114,182,0.5), 0 0 60px rgba(244,114,182,0.2)',
    glowHover: '0 0 40px rgba(244,114,182,0.7), 0 0 80px rgba(244,114,182,0.3)',
    svg: (
      <svg viewBox="0 0 128 128" className="w-10 h-10 sm:w-12 sm:h-12">
        <rect width="128" height="128" rx="24" fill="#F472B6"/>
        <path fill="none" stroke="#fff" strokeWidth="4" d="M25 90L50 55 70 72 103 35"/>
        <circle cx="103" cy="35" r="5" fill="#fff"/>
        <path fill="#fff" d="M95 28h16v14h-16z"/>
      </svg>
    ),
  },
  'Workflow Integration': {
    color: '#06B6D4',
    glow: '0 0 30px rgba(6,182,212,0.5), 0 0 60px rgba(6,182,212,0.2)',
    glowHover: '0 0 40px rgba(6,182,212,0.7), 0 0 80px rgba(6,182,212,0.3)',
    svg: (
      <svg viewBox="0 0 128 128" className="w-10 h-10 sm:w-12 sm:h-12">
        <rect width="128" height="128" rx="24" fill="#06B6D4"/>
        <circle cx="35" cy="64" r="12" fill="none" stroke="#fff" strokeWidth="3"/>
        <circle cx="93" cy="64" r="12" fill="none" stroke="#fff" strokeWidth="3"/>
        <circle cx="64" cy="35" r="12" fill="none" stroke="#fff" strokeWidth="3"/>
        <circle cx="64" cy="93" r="12" fill="none" stroke="#fff" strokeWidth="3"/>
        <line x1="47" y1="64" x2="81" y2="64" stroke="#fff" strokeWidth="3"/>
        <line x1="64" y1="47" x2="64" y2="81" stroke="#fff" strokeWidth="3"/>
      </svg>
    ),
  },
}

const DEFAULT_DATA = {
  color: '#A1A1AA',
  glow: '0 0 30px rgba(161,161,170,0.3), 0 0 60px rgba(161,161,170,0.1)',
  glowHover: '0 0 40px rgba(161,161,170,0.5), 0 0 80px rgba(161,161,170,0.2)',
  svg: null,
}

// Seeded pseudo-random for consistent but varied animation params per tech name
function seededRandom(seed) {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) - h + seed.charCodeAt(i)) | 0
  }
  return Math.abs(h) / 2147483647
}

export default function TechStackIcon({ name, index = 0 }) {
  const [hovered, setHovered] = useState(false)
  const brand = BRAND_DATA[name] || DEFAULT_DATA

  // Deterministic but varied float params per icon
  const floatParams = useMemo(() => {
    const r = (seed) => seededRandom(name + seed)
    return {
      duration: 4 + r('dur') * 4,          // 4-8s
      delay: r('del') * 3,                  // 0-3s
      yRange: -8 - r('y') * 16,             // -8 to -24px
      rotateRange: -3 + r('rot') * 6,       // -3 to 3 deg
      xRange: -6 + r('x') * 12,             // -6 to 6px
    }
  }, [name])

  return (
    <motion.div
      className="relative flex flex-col items-center gap-2 cursor-grab active:cursor-grabbing select-none"
      drag
      dragConstraints={{ left: -80, right: 80, top: -60, bottom: 60 }}
      dragElastic={0.15}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
      whileHover={{ scale: 1.15, zIndex: 20 }}
      whileTap={{ scale: 0.95, cursor: 'grabbing' }}
      animate={{
        y: [0, floatParams.yRange, 0],
        x: [0, floatParams.xRange, 0],
        rotate: [0, floatParams.rotateRange, 0],
      }}
      transition={{
        animate: {
          duration: floatParams.duration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: floatParams.delay,
        },
        hover: { type: 'spring', stiffness: 400, damping: 17 },
        tap: { type: 'spring', stiffness: 400, damping: 17 },
        drag: { type: 'spring', stiffness: 300, damping: 20 },
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        zIndex: hovered ? 20 : 10,
        filter: hovered
          ? `drop-shadow(${brand.glowHover})`
          : 'none',
      }}
    >
      {/* Icon container */}
      <div
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center border transition-all duration-300"
        style={{
          backgroundColor: hovered
            ? `${brand.color}18`
            : 'rgba(255,255,255,0.03)',
          borderColor: hovered
            ? `${brand.color}50`
            : 'rgba(255,255,255,0.08)',
          boxShadow: hovered ? brand.glowHover : 'none',
        }}
      >
        {brand.svg || (
          <span className="text-2xl sm:text-3xl" style={{ color: brand.color }}>
            {name.charAt(0)}
          </span>
        )}
      </div>

      {/* Label */}
      <span
        className="text-[10px] sm:text-xs font-medium text-center leading-tight max-w-[80px] transition-colors duration-300"
        style={{ color: hovered ? brand.color : '#71717a' }}
      >
        {name}
      </span>

      {/* Glow ring on hover */}
      {hovered && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none animate-pulse"
          style={{
            boxShadow: brand.glow,
            opacity: 0.3,
          }}
        />
      )}
    </motion.div>
  )
}
