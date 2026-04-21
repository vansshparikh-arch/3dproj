import React, { useState, useEffect, useRef } from 'react'
import { Stage, Layer, Rect, Line, Image as KonvaImage, Transformer, Group, Text } from 'react-konva'
import useImage from 'use-image'

export interface BoothConfig {
  width: number;
  depth: number;
  walls: { north: boolean; south: boolean; east: boolean; west: boolean };
}

interface CanvasProps {
  elements: any[]
  setElements: (elements: any[]) => void
  selectedId: string | null
  onSelect: (id: string | null) => void
  boothConfig: BoothConfig
  gridVisible: boolean
}

const AssetImage = ({ shapeProps, onSelect, onChange }: any) => {
  const [image] = useImage(shapeProps.src)
  
  return (
    <KonvaImage
      name={shapeProps.name}
      image={image}
      x={shapeProps.x}
      y={shapeProps.y}
      width={shapeProps.width}
      height={shapeProps.height}
      rotation={shapeProps.rotation}
      offsetX={shapeProps.width / 2}
      offsetY={shapeProps.height / 2}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        onChange({
          ...shapeProps,
          x: e.target.x(),
          y: e.target.y(),
        })
      }}
      onTransformEnd={(e) => {
        const node = e.target
        const scaleX = node.scaleX()
        const scaleY = node.scaleY()

        node.scaleX(1)
        node.scaleY(1)
        onChange({
          ...shapeProps,
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          width: Math.max(5, node.width() * scaleX),
          height: Math.max(5, node.height() * scaleY),
        })
      }}
    />
  )
}

const WallShape = ({ shapeProps, onSelect, onChange }: any) => {
  return (
    <Rect
      name={shapeProps.name}
      x={shapeProps.x}
      y={shapeProps.y}
      width={shapeProps.width}
      height={shapeProps.height}
      rotation={shapeProps.rotation}
      fill={shapeProps.fill}
      opacity={shapeProps.opacity}
      offsetX={shapeProps.width / 2}
      offsetY={shapeProps.height / 2}
      draggable
      hitStrokeWidth={20}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        onChange({ ...shapeProps, x: e.target.x(), y: e.target.y() })
      }}
      onTransformEnd={(e) => {
        const node = e.target
        const scaleX = node.scaleX()
        const scaleY = node.scaleY()
        node.scaleX(1)
        node.scaleY(1)
        onChange({
          ...shapeProps,
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          width: Math.max(5, node.width() * scaleX),
          height: Math.max(5, node.height() * scaleY),
        })
      }}
    />
  )
}

export default function Canvas({ elements, setElements, selectedId, onSelect, boothConfig, gridVisible }: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const transformerRef = useRef<any>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [stageScale, setStageScale] = useState(1)
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 })
  const [isSpacePressed, setIsSpacePressed] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)
  
  const PPM = 100 // 100px = 1 Metre
  const gridSnapSize = 50 // 0.5m visual grid (50px)
  const fineSnapSize = 10 // 0.1m snapping interval (10px)

  useEffect(() => {
    setHasMounted(true)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Control' || e.key === 'Meta') setIsSpacePressed(true)
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Control' || e.key === 'Meta') setIsSpacePressed(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useEffect(() => {
    if (!containerRef.current || !hasMounted) return

    const updateDimensions = () => {
      if (!containerRef.current) return
      const w = containerRef.current.offsetWidth
      const h = containerRef.current.offsetHeight
      setDimensions({ width: w, height: h })

      // Auto-fit 80% Scale calculation
      const boothPixelW = boothConfig.width * PPM
      const boothPixelH = boothConfig.depth * PPM
      const scaleX = (w * 0.8) / boothPixelW
      const scaleY = (h * 0.8) / boothPixelH
      const idealScale = Math.min(scaleX, scaleY, 1.5)

      setStageScale(idealScale)
      setStagePos({
        x: (w - boothPixelW * idealScale) / 2,
        y: (h - boothPixelH * idealScale) / 2,
      })
    }

    // Use ResizeObserver so Stage updates whenever the container resizes
    // (e.g. when panels are toggled, not just window resize)
    const observer = new ResizeObserver(() => {
      updateDimensions()
    })
    observer.observe(containerRef.current)
    updateDimensions() // Initial measurement

    return () => observer.disconnect()
  }, [hasMounted, boothConfig])

  useEffect(() => {
    if (selectedId && transformerRef.current) {
      const stage = transformerRef.current.getStage()
      const selectedNode = stage.findOne(`.${selectedId}`)
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode])
      } else {
        transformerRef.current.nodes([])
      }
      transformerRef.current.getLayer().batchDraw()
    } else if (transformerRef.current) {
      transformerRef.current.nodes([])
      transformerRef.current.getLayer().batchDraw()
    }
  }, [selectedId, elements])

  const handleWheel = (e: any) => {
    e.evt.preventDefault()
    const scaleBy = 1.05
    const stage = e.target.getStage()
    const oldScale = stage.scaleX()
    const pointer = stage.getPointerPosition()

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    }

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy

    setStageScale(newScale)
    setStagePos({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    })
  }

  const handleDragEndAndSnap = (index: number, newProps: any) => {
    const snapToGrid = (pos: number) => {
       if (!gridVisible) return pos
       // Snap to fineSnapSize intervals for precise placement
       return Math.round(pos / fineSnapSize) * fineSnapSize
    }
    
    const snappedProps = {
      ...newProps,
      x: snapToGrid(newProps.x),
      y: snapToGrid(newProps.y)
    }

    const newElements = elements.slice()
    newElements[index] = snappedProps
    setElements(newElements)
  }

  const boothW = boothConfig.width * PPM
  const boothD = boothConfig.depth * PPM

  const boundaryLines = [
    { dir: 'north', points: [0, 0, boothW, 0], isOpen: !boothConfig.walls.north, labelX: boothW/2, labelY: -20, dim: boothConfig.width },
    { dir: 'east', points: [boothW, 0, boothW, boothD], isOpen: !boothConfig.walls.east, labelX: boothW + 20, labelY: boothD/2, dim: boothConfig.depth, rotate: 90 },
    { dir: 'south', points: [boothW, boothD, 0, boothD], isOpen: !boothConfig.walls.south, labelX: boothW/2, labelY: boothD + 20, dim: boothConfig.width },
    { dir: 'west', points: [0, boothD, 0, 0], isOpen: !boothConfig.walls.west, labelX: -20, labelY: boothD/2, dim: boothConfig.depth, rotate: -90 },
  ]

  // Draw huge visual grid (1m x 1m)
  const gridLines = []
  if (gridVisible) {
    const vSize = 4000
    const offset = 1000
    const subStep = 20 // 0.1m subdivisions
    
    for (let i = -offset; i <= vSize / subStep; i++) {
       const isMajor = (i * subStep) % gridSnapSize === 0
       gridLines.push(
         <Line 
           key={`v-${i}`} 
           points={[i * subStep, -offset * subStep, i * subStep, vSize]} 
           stroke={isMajor ? "rgba(23, 58, 64, 0.3)" : "rgba(23, 58, 64, 0.15)"} 
           strokeWidth={isMajor ? 1.5 : 1} 
         />
       )
    }
    for (let j = -offset; j <= vSize / subStep; j++) {
       const isMajor = (j * subStep) % gridSnapSize === 0
       gridLines.push(
         <Line 
           key={`h-${j}`} 
           points={[-offset * subStep, j * subStep, vSize, j * subStep]} 
           stroke={isMajor ? "rgba(23, 58, 64, 0.3)" : "rgba(23, 58, 64, 0.15)"} 
           strokeWidth={isMajor ? 1.5 : 1} 
         />
       )
    }
  }

  const selectedElement = elements.find(el => el.id === selectedId)

  return (
    <div ref={containerRef} className="flex-1 bg-[var(--bg-base)] overflow-hidden relative cursor-crosshair">
      {hasMounted && (
        <Stage
          width={dimensions.width}
          height={dimensions.height}
          scaleX={stageScale}
          scaleY={stageScale}
          x={stagePos.x}
          y={stagePos.y}
          draggable={isSpacePressed}
          onWheel={handleWheel}
          onDragEnd={(e) => {
            if (e.target === e.target.getStage()) {
              setStagePos({ x: e.target.x(), y: e.target.y() })
            }
          }}
          onMouseDown={(e) => {
            if (e.target === e.target.getStage() || e.target.name() === 'floorBg') {
              onSelect(null)
            }
          }}
        >
          <Layer>
            {gridLines}

            {/* Booth Floor Area */}
            <Group name="boothBoundaries">
               <Rect
                 name="floorBg"
                 x={0}
                 y={0}
                 width={boothW}
                 height={boothD}
                 fill="rgba(255,255,255,0.3)"
                 shadowColor="rgba(0,0,0,0.1)"
                 shadowBlur={40}
               />
               
               {boundaryLines.map((line) => (
                 <React.Fragment key={line.dir}>
                   <Line
                     points={line.points}
                     stroke={line.isOpen ? 'rgba(23,58,64,0.3)' : '#ef4444'} // Dashed gray OR Solid Red
                     strokeWidth={line.isOpen ? 2 : 4}
                     dash={line.isOpen ? [10, 10] : []}
                   />
                   <Text
                     x={line.labelX}
                     y={line.labelY}
                     text={`${line.dim}m`}
                     fontSize={16}
                     fontFamily="monospace"
                     fill="var(--sea-ink)"
                     fontStyle="bold"
                     offset={{ x: 20, y: 10 }}
                     rotation={line.rotate || 0}
                     opacity={0.6}
                   />
                 </React.Fragment>
               ))}
            </Group>

            {/* Render Elements */}
            {elements.map((obj, i) => {
               if (obj.type === 'wall') {
                 return (
                   <WallShape
                     key={obj.id}
                     shapeProps={{ ...obj, name: obj.id }}
                     onSelect={() => onSelect(obj.id)}
                     onChange={(newProps: any) => handleDragEndAndSnap(i, newProps)}
                   />
                 )
               }
               if (obj.type === 'asset') {
                 return (
                   <AssetImage
                     key={obj.id}
                     shapeProps={{ ...obj, name: obj.id }}
                     onSelect={() => onSelect(obj.id)}
                     onChange={(newProps: any) => handleDragEndAndSnap(i, newProps)}
                   />
                 )
               }
               return null
            })}

            {/* Transformer */}
            <Transformer 
               ref={transformerRef} 
               boundBoxFunc={(oldBox, newBox) => {
                 if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) return oldBox
                 return newBox
               }}
               enabledAnchors={
                 selectedElement?.type === 'wall' 
                   ? ['middle-left', 'middle-right'] 
                   : ['top-left', 'top-center', 'top-right', 'middle-right', 'bottom-right', 'bottom-center', 'bottom-left', 'middle-left']
               }
               keepRatio={false}
               padding={6}
               anchorSize={12}
               anchorCornerRadius={3}
               borderStroke="#0d7a75"
               borderStrokeWidth={2}
               anchorStroke="#0d7a75"
               anchorFill="white"
               anchorStrokeWidth={2}
               rotateEnabled={true}
               rotateAnchorOffset={40}
               rotateAnchorCursor="crosshair"
            />
          </Layer>
        </Stage>
      )}

      <div className="absolute bottom-4 left-4 z-10 flex gap-2">
        <div className="px-3 py-1.5 rounded-lg bg-[var(--surface-strong)] border border-[var(--line)] text-[10px] font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider shadow-sm flex items-center gap-2">
          <span>Zoom: {Math.round(stageScale * 100)}%</span>
          <div className="w-px h-3 bg-[var(--line)]" />
          <span>Pan: Space+Drag</span>
        </div>
      </div>
    </div>
  )
}
