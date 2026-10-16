import { useContext, type ReactNode } from 'react'
import { LibrarySearchContext } from './library-search'

interface SpecimenProps {
  name: string
  description: string
  children: ReactNode
  id?: string
}

export function Specimen({ name, description, children, id }: SpecimenProps) {
  const search = useContext(LibrarySearchContext)
  const visible = `${name} ${description}`.toLocaleLowerCase().includes(search)

  return (
    <div
      className="library-specimen"
      data-component={name}
      id={id}
      hidden={!visible}
    >
      <div className="library-specimen-label">
        <h3>{name}</h3>
        <p>{description}</p>
      </div>
      <div className="library-specimen-content">{children}</div>
    </div>
  )
}
