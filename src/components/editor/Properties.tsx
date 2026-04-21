import { Settings, Code, Trash2 } from 'lucide-react'

interface PropertiesProps {
  selectedElement: any
  onUpdate: (id: string, newProps: any) => void
  onDelete: () => void
}

export default function Properties({ selectedElement, onUpdate, onDelete }: PropertiesProps) {
  
  const handleMaterialChange = (material: string) => {
    let fill = '#333333'
    let opacity = 1
    
    if (material === 'Glass Walk') {
      fill = 'lightblue'
      opacity = 0.5
    } else if (material === 'Wood') {
      fill = '#8B4513'
      opacity = 1
    }

    onUpdate(selectedElement.id, { material, fill, opacity })
  }

  return (
    <aside className="w-80 border-l border-[var(--line)] bg-[var(--surface-strong)] flex flex-col">
      <div className="p-4 border-b border-[var(--line)] flex justify-between items-center bg-[var(--header-bg)]">
        <h3 className="font-bold text-[var(--sea-ink)] flex items-center gap-2">
          <Settings className="h-5 w-5 text-[var(--lagoon-deep)]" />
          Properties
        </h3>
        {selectedElement && (
           <button 
             onClick={onDelete}
             className="text-red-500 hover:text-white hover:bg-red-500 p-1.5 rounded-lg transition"
             title="Delete (Backspace)"
           >
             <Trash2 className="h-4 w-4" />
           </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {selectedElement ? (
          <div>
            <div className="space-y-4">
              
              {/* Type / ID display */}
              <div>
                <label className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-1">
                  Type / ID
                </label>
                <div className="w-full bg-[var(--sand)] border-transparent border rounded-lg px-3 py-2 text-[10px] font-mono text-[var(--sea-ink)] select-all">
                  {selectedElement.type.toUpperCase()} / {selectedElement.id.slice(0, 8)}
                </div>
              </div>

              {/* Transform properties */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-1">
                    Pos X (m)
                  </label>
                  <input 
                    type="number" 
                    step="0.05"
                    value={((selectedElement.x || 0) / 100).toFixed(2)} 
                    onChange={(e) => onUpdate(selectedElement.id, { x: parseFloat(e.target.value) * 100 || 0 })}
                    className="w-full bg-[var(--sand)] border border-[var(--line)] focus:border-[var(--lagoon)] rounded-lg px-3 py-2 text-sm outline-none" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-1">
                    Pos Y (m)
                  </label>
                  <input 
                    type="number" 
                    step="0.05"
                    value={((selectedElement.y || 0) / 100).toFixed(2)} 
                    onChange={(e) => onUpdate(selectedElement.id, { y: parseFloat(e.target.value) * 100 || 0 })}
                    className="w-full bg-[var(--sand)] border border-[var(--line)] focus:border-[var(--lagoon)] rounded-lg px-3 py-2 text-sm outline-none" 
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-1">
                    Dimensions (Meters)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[var(--sea-ink-soft)] font-bold">W</span>
                      <input 
                        type="number" 
                        step="0.05"
                        value={((selectedElement.width || 0) / 100).toFixed(2)} 
                        onChange={(e) => onUpdate(selectedElement.id, { width: parseFloat(e.target.value) * 100 || 0 })}
                        className="w-full bg-[var(--sand)] border border-[var(--line)] focus:border-[var(--lagoon)] rounded-lg px-2 py-1.5 text-xs outline-none" 
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[var(--sea-ink-soft)] font-bold">H</span>
                      <input 
                        type="number" 
                        step="0.05"
                        value={((selectedElement.height || 0) / 100).toFixed(2)} 
                        onChange={(e) => onUpdate(selectedElement.id, { height: parseFloat(e.target.value) * 100 || 0 })}
                        className="w-full bg-[var(--sand)] border border-[var(--line)] focus:border-[var(--lagoon)] rounded-lg px-2 py-1.5 text-xs outline-none" 
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-1">
                    Rotation (Deg)
                  </label>
                  <input 
                    type="number" 
                    value={Math.round(selectedElement.rotation) || 0} 
                    onChange={(e) => onUpdate(selectedElement.id, { rotation: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[var(--sand)] border border-[var(--line)] focus:border-[var(--lagoon)] rounded-lg px-3 py-2 text-sm outline-none mb-2" 
                  />
                  <div className="flex gap-2">
                     <button 
                       onClick={() => onUpdate(selectedElement.id, { rotation: (selectedElement.rotation || 0) - 90 })}
                       className="flex-1 bg-[var(--surface-strong)] hover:bg-[var(--chip-bg)] border border-[var(--line)] rounded-lg py-1.5 text-xs font-bold text-[var(--sea-ink)] transition"
                     >
                        -90° (Left)
                     </button>
                     <button 
                       onClick={() => onUpdate(selectedElement.id, { rotation: (selectedElement.rotation || 0) + 90 })}
                       className="flex-1 bg-[var(--surface-strong)] hover:bg-[var(--chip-bg)] border border-[var(--line)] rounded-lg py-1.5 text-xs font-bold text-[var(--sea-ink)] transition"
                     >
                        +90° (Right)
                     </button>
                  </div>
                </div>
              </div>

              {/* Material Dropdown for Walls */}
              {selectedElement.type === 'wall' && (
                 <div>
                   <label className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-1 mt-4">
                     Wall Material
                   </label>
                   <select 
                     value={selectedElement.material || 'Solid Wall'}
                     onChange={(e) => handleMaterialChange(e.target.value)}
                     className="w-full bg-[var(--sand)] border border-[var(--line)] focus:border-[var(--lagoon)] rounded-lg px-3 py-2 text-sm text-[var(--sea-ink)] outline-none"
                   >
                     <option value="Solid Wall">Solid Wall</option>
                     <option value="Glass Walk">Glass Walk</option>
                     <option value="Wood">Wood</option>
                   </select>
                 </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-[var(--bg-base)] rounded-2xl border border-dashed border-[var(--line)]">
            <span className="text-4xl mb-3">🖱️</span>
            <p className="text-sm font-semibold text-[var(--sea-ink)]">No Object Selected</p>
            <p className="text-xs text-[var(--sea-ink-soft)] mt-1">Click an item on the canvas to view its properties.</p>
          </div>
        )}

        <div className="pt-4 border-t border-[var(--line)]">
          <h4 className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider flex items-center gap-2 mb-3">
            <Code className="h-4 w-4" />
            JSON Preview
          </h4>
          <pre className="bg-[#1e1e1e] text-[#b8efe5] p-3 rounded-xl text-[10px] overflow-x-auto shadow-inner leading-relaxed max-h-48">
            {JSON.stringify(selectedElement || { status: 'idle', workspace: 'ready' }, null, 2)}
          </pre>
        </div>
      </div>
    </aside>
  )
}
