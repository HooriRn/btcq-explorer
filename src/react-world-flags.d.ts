declare module 'react-world-flags' {
  import { ComponentType, HTMLAttributes } from 'react'

  interface FlagProps extends HTMLAttributes<HTMLImageElement> {
    code: string
    className?: string
    style?: React.CSSProperties
  }

  const Flag: ComponentType<FlagProps>
  export default Flag
}



