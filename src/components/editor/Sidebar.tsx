import { useState } from 'react'
import { Box, Layers, PlusSquare, ChevronDown, ChevronRight } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

export default function Sidebar({ addElement }: { addElement: (el: any) => void }) {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    'Fixtures': true,
    'Chairs': false,
    'Bar_Chairs': false,
    'Tables': false,
    'Round_Tables': false,
    'Info_Desks': false,
  })

  const toggleCategory = (folder: string) => {
    setOpenCategories(prev => ({ ...prev, [folder]: !prev[folder] }))
  }

  const categories = [
    { name: 'Fixtures', folder: 'Fixtures', items: ['dustbin.svg', 'plant.svg', 'sink.svg'] },
    { name: 'Chairs', folder: 'Chairs', items: ['chair_1.svg', 'chair_2.svg', 'chair_3.svg', 'chair_4.svg', 'chair_5.svg'] },
    { name: 'Bar Chairs', folder: 'Bar_Chairs', items: ['bar_chair_1.svg', 'bar_chair_2.svg'] },
    { name: 'Tables', folder: 'Tables', items: ['table1.svg', 'table2.svg', 'table3.svg'] },
    { name: 'Round Tables', folder: 'Round_Tables', items: ['round_table_1.svg', 'round_table_2.svg', 'round_table_3.svg'] },
    { name: 'Info Desks', folder: 'Info_Desks', items: ['infodesk_1.svg', 'infodesk_2.svg', 'infodesk_3.svg'] },
  ]

  const addWall = () => {
    addElement({
      id: uuidv4(),
      type: 'wall',
      x: 100,
      y: 100,
      width: 200,
      height: 20,
      rotation: 0,
      fill: '#333333',
      opacity: 1,
      material: 'Solid Wall'
    })
  }

  const addAsset = (categoryFolder: string, filename: string) => {
    addElement({
      id: uuidv4(),
      type: 'asset',
      assetName: filename.split('.')[0],
      src: `/assets/${categoryFolder}/${filename}`,
      x: 100,
      y: 100,
      rotation: 0,
      width: 50,
      height: 50,
    })
  }

  return (
    <aside className="w-64 border-r border-[var(--line)] bg-[var(--surface-strong)] flex flex-col overflow-hidden">
      <div className="p-4 border-b border-[var(--line)] shrink-0">
        <h3 className="font-bold text-[var(--sea-ink)] flex items-center gap-2">
          <Box className="h-5 w-5 text-[var(--lagoon-deep)]" />
          Asset Library
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--sea-ink-soft)] mb-2">
            Core Structures
          </p>
          <button
            onClick={addWall}
            className="w-full flex items-center justify-center gap-2 p-3 bg-[var(--sea-ink)] text-white rounded-xl font-semibold hover:bg-[var(--palm)] transition shadow-sm"
          >
            <PlusSquare className="h-4 w-4" /> Add Wall
          </button>
        </div>

        <div className="w-full h-px bg-[var(--line)] my-2" />

        {categories.map((cat) => {
          const isOpen = openCategories[cat.folder];
          return (
            <div key={cat.folder} className="border-b border-[var(--line)] pb-2 last:border-0">
              <button
                onClick={() => toggleCategory(cat.folder)}
                className="w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[var(--sea-ink-soft)] py-2 hover:text-[var(--lagoon-deep)] transition-colors group"
              >
                <span className="flex items-center gap-2">
                  <Layers className="h-3 w-3" /> {cat.name}
                </span>
                {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </button>

              {isOpen && (
                <div className="grid grid-cols-2 gap-2 mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  {cat.items.map((item) => (
                    <button
                      key={item}
                      onClick={() => addAsset(cat.folder, item)}
                      className="flex flex-col items-center justify-center p-3 rounded-lg border border-[var(--line)] hover:border-[var(--lagoon)] hover:bg-[var(--sand)] transition text-xs font-medium text-[var(--sea-ink)] hover:text-[var(--lagoon-deep)] group"
                    >
                      <span className="truncate w-full text-center">{item.split('.')[0].replace(/_/g, ' ')}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}
