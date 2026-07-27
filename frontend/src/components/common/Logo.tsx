import lucidLogo from '../../assets/lucid-logo.png'

interface LogoProps {
  className?: string
  imageClassName?: string
  variant?: 'full' | 'compact'
}

export const Logo = ({
  className = '',
  imageClassName = '',
  variant = 'full',
}: LogoProps) => {
  const sizeClass = variant === 'compact' ? 'h-14 w-14' : 'h-24 w-auto'

  return (
    <div className={`inline-flex items-center ${className}`}>
      <img
        alt="Lucid"
        className={`${sizeClass} object-contain ${imageClassName}`}
        src={lucidLogo}
      />
    </div>
  )
}
