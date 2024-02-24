'use client'
// Component for conditional rendering. Taken from: https://medium.com/@brandonlostboy/build-it-better-next-js-conditional-rendering-be5617431cef
// Brilliant idea to clean up Next.js code!

import {ReactNode} from 'react'
export default function Conditional({showWhen, children}: {showWhen: boolean, children: ReactNode}){
	if (showWhen){
		return <>{children}</>;
	}
	return <></>
}
