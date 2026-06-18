"use client"

import React, { useCallback, useRef, useState, useMemo, type JSX } from "react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type PanInfo,
} from "framer-motion"
import { Check, Loader2, SendHorizontal, X, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

const DRAG_CONSTRAINTS = { left: 0, right: 155 }
const DRAG_THRESHOLD = 0.9
const SPRING = { type: "spring" as const, stiffness: 400, damping: 40, mass: 0.8 }

const SHAKE_ANIM = {
  x: [0, -10, 10, -8, 8, -4, 4, 0],
  transition: { duration: 0.45, ease: "easeInOut" as const },
}

const StatusIcon: React.FC<{ status: string }> = ({ status }) => {
  const icons: Record<string, JSX.Element> = useMemo(
    () => ({
      loading: <Loader2 className="animate-spin text-white" size={22} />,
      success: <Check className="text-white" size={22} />,
      error: <X className="text-white" size={22} />,
    }),
    []
  )
  if (!icons[status]) return null
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
    >
      {icons[status]}
    </motion.div>
  )
}

interface SlideButtonProps {
  onSlideComplete: () => void
  status: "idle" | "loading" | "success" | "error"
  /** Se true, o botão trava e dá shake vermelho quando o usuário tenta enviar */
  disabled?: boolean
  /** Mensagem de erro inline quando disabled e o usuário tentou deslizar */
  validationMessage?: string
  className?: string
}

export function SlideButton({
  onSlideComplete,
  status,
  disabled = false,
  validationMessage = "Preencha todos os campos corretamente",
  className,
}: SlideButtonProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [shaking, setShaking] = useState(false)
  const [showError, setShowError] = useState(false)
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dragHandleRef = useRef<HTMLDivElement | null>(null)

  const dragX = useMotionValue(0)
  const springX = useSpring(dragX, SPRING)
  const dragProgress = useTransform(springX, [0, DRAG_CONSTRAINTS.right], [0, 1])
  const fillWidth = useTransform(springX, (x) => x + 48)

  const triggerShake = useCallback(() => {
    dragX.set(0)
    // Shake animation: 450ms
    setShaking(true)
    setTimeout(() => setShaking(false), 500)
    // Error message: 3500ms
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current)
    setShowError(true)
    errorTimerRef.current = setTimeout(() => setShowError(false), 3500)
  }, [dragX])

  // Cleanup error timer on unmount
  React.useEffect(() => {
    return () => { if (errorTimerRef.current) clearTimeout(errorTimerRef.current) }
  }, [])

  const handleDragStart = useCallback(() => {
    if (completed) return
    setIsDragging(true)
  }, [completed])

  const handleDragEnd = useCallback(() => {
    if (completed) return
    setIsDragging(false)

    if (dragProgress.get() >= DRAG_THRESHOLD) {
      if (disabled) {
        triggerShake()
      } else {
        setCompleted(true)
        onSlideComplete()
      }
    } else {
      dragX.set(0)
    }
  }, [completed, disabled, dragProgress, dragX, onSlideComplete, triggerShake])

  const handleDrag = useCallback(
    (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (completed) return
      dragX.set(Math.max(0, Math.min(info.offset.x, DRAG_CONSTRAINTS.right)))
    },
    [completed, dragX]
  )

  // Reset ao estado original quando o pai seta status de volta para idle
  React.useEffect(() => {
    if (status === "idle" && completed) {
      setCompleted(false)
      dragX.set(0)
    }
  }, [status, completed, dragX])

  return (
    <div className={cn("space-y-2", className)}>
      <motion.div
        animate={
          shaking
            ? SHAKE_ANIM
            : completed
            ? { width: "7rem" }
            : { width: "100%" }
        }
        transition={shaking ? undefined : SPRING}
        className="relative flex h-12 items-center justify-center rounded-xl overflow-hidden mx-auto"
        style={{
          background: showError ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.03)",
          border: `1px solid ${showError ? "rgba(239,68,68,0.45)" : "rgba(168,85,247,0.22)"}`,
          transition: "background 0.3s, border-color 0.3s",
        }}
      >
        {/* Fill que acompanha o drag */}
        {!completed && (
          <motion.div
            className="absolute inset-y-0 left-0 z-0 rounded-xl"
            style={{
              width: fillWidth,
              background: showError
                ? "linear-gradient(135deg,#dc2626,#ef4444)"
                : "linear-gradient(135deg,#7c3aed,#a855f7)",
            }}
          />
        )}

        {/* Label central */}
        {!completed && (
          <span
            className="text-xs sm:text-sm font-semibold select-none pointer-events-none z-10 transition-colors duration-200"
            style={{
              color: showError
                ? "rgba(252,165,165,0.7)"
                : disabled
                ? "rgba(255,255,255,0.22)"
                : "rgba(196,132,252,0.55)",
            }}
          >
            {showError ? "Corrija os campos ↑" : "Deslize para enviar →"}
          </span>
        )}

        {/* Handle arrastável */}
        <AnimatePresence>
          {!completed && (
            <motion.div
              ref={dragHandleRef}
              drag="x"
              dragConstraints={DRAG_CONSTRAINTS}
              dragElastic={0.05}
              dragMomentum={false}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDrag={handleDrag}
              style={{ x: springX }}
              className="absolute left-0 z-10 flex cursor-grab active:cursor-grabbing"
            >
              <button
                type="button"
                disabled={status === "loading"}
                className={cn(
                  "h-12 w-12 rounded-xl flex items-center justify-center text-white transition-all duration-150",
                  isDragging && !disabled && "scale-105"
                )}
                style={{
                  background: shaking
                    ? "linear-gradient(135deg,#dc2626,#ef4444)"
                    : disabled
                    ? "rgba(100,60,160,0.35)"
                    : "linear-gradient(135deg,#7c3aed,#a855f7)",
                  boxShadow: shaking
                    ? "0 0 18px rgba(239,68,68,0.5)"
                    : disabled
                    ? "none"
                    : "0 0 18px rgba(168,85,247,0.55)",
                  cursor: disabled ? "not-allowed" : "grab",
                }}
              >
                {shaking ? (
                  <AlertTriangle className="size-5" />
                ) : (
                  <SendHorizontal className="size-5" />
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Estado completado */}
        <AnimatePresence>
          {completed && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                boxShadow: "0 0 24px rgba(168,85,247,0.45)",
              }}
            >
              <AnimatePresence mode="wait">
                <StatusIcon status={status} />
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Mensagem de validação — dura 3.5s após o shake */}
      <AnimatePresence>
        {showError && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-xs text-red-400 text-center font-medium"
          >
            {validationMessage}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
