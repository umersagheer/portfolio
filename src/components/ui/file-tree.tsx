'use client'

import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'
import { Button, cn } from '@heroui/react'
import { IconChevronRight, IconFile, IconFolder, IconFolderOpen } from '@tabler/icons-react'

type TreeViewElement = {
  id: string
  name: string
  type?: 'file' | 'folder'
  isSelectable?: boolean
  children?: TreeViewElement[]
}

type TreeSortMode =
  | 'default'
  | 'none'
  | ((a: TreeViewElement, b: TreeViewElement) => number)

type TreeContextProps = {
  selectedId: string | undefined
  expandedItems: string[]
  indicator: boolean
  handleExpand: (id: string) => void
  selectItem: (id: string) => void
  setExpandedItems: React.Dispatch<React.SetStateAction<string[]>>
  openIcon?: React.ReactNode
  closeIcon?: React.ReactNode
  direction: 'rtl' | 'ltr'
}

const TreeContext = createContext<TreeContextProps | null>(null)

const useTree = () => {
  const context = useContext(TreeContext)

  if (!context) {
    throw new Error('useTree must be used within a TreeProvider')
  }

  return context
}

const treeCollator = new Intl.Collator('en', {
  numeric: true,
  sensitivity: 'base'
})

const isFolderElement = (element: TreeViewElement) => {
  if (element.type) {
    return element.type === 'folder'
  }

  return Array.isArray(element.children)
}

const defaultTreeComparator = (a: TreeViewElement, b: TreeViewElement) => {
  const aIsFolder = isFolderElement(a)
  const bIsFolder = isFolderElement(b)

  if (aIsFolder !== bIsFolder) {
    return aIsFolder ? -1 : 1
  }

  return treeCollator.compare(a.name, b.name)
}

const getTreeComparator = (sort: TreeSortMode) => {
  if (sort === 'none') {
    return undefined
  }

  if (sort === 'default') {
    return defaultTreeComparator
  }

  return sort
}

const sortTreeElements = (
  elements: TreeViewElement[],
  sort: TreeSortMode
): TreeViewElement[] => {
  const comparator = getTreeComparator(sort)

  const nextElements = elements.map(element => {
    if (!Array.isArray(element.children)) {
      return element
    }

    return {
      ...element,
      children: sortTreeElements(element.children, sort)
    }
  })

  if (!comparator) {
    return nextElements
  }

  return [...nextElements].sort(comparator)
}

const mergeExpandedItems = (currentItems: string[], nextItems: string[]) =>
  Array.from(new Set([...currentItems, ...nextItems]))

const buildExpansionPath = (
  elements: TreeViewElement[] | undefined,
  targetId: string,
  currentPath: string[] = []
): string[] => {
  if (!elements) return []

  for (const element of elements) {
    const nextPath = isFolderElement(element)
      ? [...currentPath, element.id]
      : currentPath

    if (element.id === targetId) {
      return currentPath
    }

    if (Array.isArray(element.children)) {
      const childPath = buildExpansionPath(element.children, targetId, nextPath)

      if (childPath.length > 0) {
        return childPath
      }
    }
  }

  return []
}

const renderTreeElements = (
  elements: TreeViewElement[],
  sort: TreeSortMode
): React.ReactNode =>
  sortTreeElements(elements, sort).map(element => {
    if (isFolderElement(element)) {
      return (
        <Folder
          key={element.id}
          value={element.id}
          element={element.name}
          isSelectable={element.isSelectable}
        >
          {Array.isArray(element.children)
            ? renderTreeElements(element.children, sort)
            : null}
        </Folder>
      )
    }

    return (
      <File
        key={element.id}
        value={element.id}
        isSelectable={element.isSelectable}
      >
        <span>{element.name}</span>
      </File>
    )
  })

type TreeViewProps = {
  initialSelectedId?: string
  indicator?: boolean
  elements?: TreeViewElement[]
  initialExpandedItems?: string[]
  openIcon?: React.ReactNode
  closeIcon?: React.ReactNode
  sort?: TreeSortMode
  dir?: 'rtl' | 'ltr'
} & React.HTMLAttributes<HTMLDivElement>

const Tree = forwardRef<HTMLDivElement, TreeViewProps>(
  (
    {
      className,
      elements,
      initialSelectedId,
      initialExpandedItems,
      children,
      indicator = true,
      openIcon,
      closeIcon,
      sort = 'default',
      dir,
      ...props
    },
    ref
  ) => {
    const [selectedId, setSelectedId] = useState<string | undefined>(
      initialSelectedId
    )
    const [expandedItems, setExpandedItems] = useState<string[]>(
      initialExpandedItems ?? []
    )

    const selectItem = useCallback((id: string) => {
      setSelectedId(id)
    }, [])

    const handleExpand = useCallback((id: string) => {
      setExpandedItems(prev =>
        prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
      )
    }, [])

    useEffect(() => {
      if (!initialSelectedId) return

      setSelectedId(initialSelectedId)

      const path = buildExpansionPath(elements, initialSelectedId)

      if (path.length > 0) {
        setExpandedItems(prev => mergeExpandedItems(prev, path))
      }
    }, [elements, initialSelectedId])

    const direction = dir === 'rtl' ? 'rtl' : 'ltr'
    const treeChildren =
      children ?? (elements ? renderTreeElements(elements, sort) : null)

    return (
      <TreeContext.Provider
        value={{
          selectedId,
          expandedItems,
          handleExpand,
          selectItem,
          setExpandedItems,
          indicator,
          openIcon,
          closeIcon,
          direction
        }}
      >
        <div
          ref={ref}
          dir={direction}
          className={cn('size-full overflow-auto px-2', className)}
          role='tree'
          {...props}
        >
          <div className='flex flex-col gap-1'>{treeChildren}</div>
        </div>
      </TreeContext.Provider>
    )
  }
)

Tree.displayName = 'Tree'

const TreeIndicator = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { direction } = useTree()

  return (
    <div
      dir={direction}
      ref={ref}
      className={cn(
        'absolute bottom-2 top-2 w-px rounded-full bg-default-200',
        direction === 'rtl' ? 'right-2' : 'left-2',
        className
      )}
      {...props}
    />
  )
})

TreeIndicator.displayName = 'TreeIndicator'

type FolderProps = {
  element: string
  value: string
  isSelectable?: boolean
  isSelect?: boolean
} & React.HTMLAttributes<HTMLDivElement>

const Folder = forwardRef<HTMLDivElement, FolderProps>(
  (
    {
      className,
      element,
      value,
      isSelectable = true,
      isSelect,
      children,
      ...props
    },
    ref
  ) => {
    const {
      direction,
      handleExpand,
      expandedItems,
      indicator,
      selectedId,
      selectItem,
      openIcon,
      closeIcon
    } = useTree()

    const isExpanded = expandedItems.includes(value)
    const isSelected = isSelect ?? selectedId === value

    return (
      <div ref={ref} className={cn('relative', className)} {...props}>
        <button
          type='button'
          disabled={!isSelectable}
          className={cn(
            'flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors',
            isSelectable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50',
            isSelected && isSelectable
              ? 'bg-default-100 text-foreground'
              : 'text-default-600 hover:bg-default-100'
          )}
          onClick={() => {
            selectItem(value)
            handleExpand(value)
          }}
        >
          <IconChevronRight
            size={14}
            className={cn(
              'shrink-0 text-default-400 transition-transform',
              isExpanded && (direction === 'rtl' ? '-rotate-90' : 'rotate-90')
            )}
          />
          <span className='shrink-0 text-default-500'>
            {isExpanded
              ? (openIcon ?? <IconFolderOpen size={16} />)
              : (closeIcon ?? <IconFolder size={16} />)}
          </span>
          <span>{element}</span>
        </button>

        {isExpanded && (
          <div
            className={cn(
              'relative mt-1 flex flex-col gap-1 pl-5',
              direction === 'rtl' && 'pl-0 pr-5'
            )}
            role='group'
          >
            {element && indicator && <TreeIndicator aria-hidden='true' />}
            {children}
          </div>
        )}
      </div>
    )
  }
)

Folder.displayName = 'Folder'

const File = forwardRef<
  HTMLButtonElement,
  {
    value: string
    handleSelect?: (id: string) => void
    isSelectable?: boolean
    isSelect?: boolean
    fileIcon?: React.ReactNode
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
>(
  (
    {
      value,
      className,
      handleSelect,
      onClick,
      isSelectable = true,
      isSelect,
      fileIcon,
      children,
      ...props
    },
    ref
  ) => {
    const { direction, selectedId, selectItem } = useTree()
    const isSelected = isSelect ?? selectedId === value

    return (
      <button
        ref={ref}
        type='button'
        disabled={!isSelectable}
        className={cn(
          'flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors',
          isSelectable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50',
          isSelected && isSelectable
            ? 'bg-default-100 text-foreground'
            : 'text-default-600 hover:bg-default-100',
          direction === 'rtl' ? 'flex-row-reverse text-right' : 'text-left',
          className
        )}
        onClick={event => {
          selectItem(value)
          handleSelect?.(value)
          onClick?.(event)
        }}
        {...props}
      >
        <span className='shrink-0 text-default-500'>
          {fileIcon ?? <IconFile size={16} />}
        </span>
        {children}
      </button>
    )
  }
)

File.displayName = 'File'

const CollapseButton = forwardRef<
  HTMLButtonElement,
  {
    elements: TreeViewElement[]
    expandAll?: boolean
    className?: string
    children?: React.ReactNode
  }
>(({ className, elements, expandAll = false, children }, ref) => {
  const { expandedItems, setExpandedItems } = useTree()

  const expandAllTree = useCallback((treeElements: TreeViewElement[]) => {
    const expandedElementIds: string[] = []

    const expandTree = (element: TreeViewElement) => {
      const isSelectable = element.isSelectable ?? true

      if (
        isSelectable &&
        Array.isArray(element.children) &&
        element.children.length > 0
      ) {
        expandedElementIds.push(element.id)
        element.children.forEach(expandTree)
      }
    }

    treeElements.forEach(expandTree)

    return Array.from(new Set(expandedElementIds))
  }, [])

  useEffect(() => {
    if (expandAll) {
      setExpandedItems(expandAllTree(elements))
    }
  }, [elements, expandAll, expandAllTree, setExpandedItems])

  return (
    <Button
      ref={ref}
      size='sm'
      variant='flat'
      className={cn('h-8 w-fit', className)}
      onPress={() => {
        if (expandedItems.length > 0) {
          setExpandedItems([])
          return
        }

        setExpandedItems(expandAllTree(elements))
      }}
    >
      {children}
    </Button>
  )
})

CollapseButton.displayName = 'CollapseButton'

export { CollapseButton, File, Folder, Tree, type TreeViewElement }
export type { TreeSortMode }
