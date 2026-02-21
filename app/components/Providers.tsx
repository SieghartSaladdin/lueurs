"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { PrimeReactProvider } from "primereact/api";
import Tailwind from "primereact/passthrough/tailwind";
import { twMerge } from "tailwind-merge";
import LoginToast from "./LoginToast";

// Customize the default Tailwind passthrough to match Lueurs theme
const CustomTailwind = {
  ...Tailwind,
  button: {
    ...Tailwind.button,
    root: ({ props, context, parent }: any) => {
      const isText = props.text;
      const isOutlined = props.outlined;
      const isDanger = props.severity === 'danger';
      
      return {
        className: twMerge(
          // Base
          'items-center cursor-pointer inline-flex overflow-hidden relative select-none text-center align-bottom transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2',
          // Spacing & Shape
          'px-4 py-2 rounded-md text-sm font-medium',
          // Colors
          !isText && !isOutlined && !isDanger && 'bg-black text-white hover:bg-gray-800 focus:ring-black border border-transparent',
          isText && !isDanger && 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
          isDanger && !isText && 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600 border border-transparent',
          isDanger && isText && 'bg-transparent text-red-600 hover:bg-red-50 focus:ring-red-600',
          // Disabled
          props.disabled && 'opacity-50 cursor-default pointer-events-none'
        )
      };
    },
    icon: ({ props }: any) => ({
      className: twMerge(
        'mx-0',
        props.label != null && 'mr-2'
      )
    }),
    label: {
      className: 'flex-1 font-medium'
    }
  },
  inputtext: {
    ...Tailwind.inputtext,
    root: ({ props, context }: any) => ({
      className: twMerge(
        'm-0 font-sans text-gray-700 bg-white border border-gray-300 transition-colors duration-200 appearance-none rounded-md',
        'hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black',
        'px-3 py-2 w-full text-sm',
        props.disabled && 'opacity-50 cursor-default pointer-events-none bg-gray-50'
      )
    })
  },
  inputtextarea: {
    ...Tailwind.inputtextarea,
    root: ({ props, context }: any) => ({
      className: twMerge(
        'm-0 font-sans text-gray-700 bg-white border border-gray-300 transition-colors duration-200 appearance-none rounded-md',
        'hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black',
        'px-3 py-2 w-full text-sm',
        props.disabled && 'opacity-50 cursor-default pointer-events-none bg-gray-50'
      )
    })
  },
  checkbox: {
    ...Tailwind.checkbox,
    root: {
      className: 'cursor-pointer inline-flex relative select-none align-bottom w-5 h-5'
    },
    box: ({ props, context }: any) => ({
      className: twMerge(
        'flex items-center justify-center w-5 h-5 rounded border transition-colors duration-200',
        context.checked ? 'border-black bg-black text-white' : 'border-gray-300 bg-white text-gray-700',
        !props.disabled && context.checked && 'hover:bg-gray-800 hover:border-gray-800',
        !props.disabled && !context.checked && 'hover:border-gray-400',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black'
      )
    })
  },
};

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PrimeReactProvider value={{ 
        unstyled: true, 
        pt: CustomTailwind,
        ptOptions: {
          mergeSections: true,
          mergeProps: true,
          classNameMergeFunction: twMerge
        }
      }}>
        {children}
        <LoginToast />
        <Toaster 
          position="top-center" 
          toastOptions={{
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
        />
      </PrimeReactProvider>
    </SessionProvider>
  );
}
