import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pause, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { FilterChip } from '@/components/ui/filter-chip'
import { SplashArtwork } from '@/components/splash'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Specimen } from './Specimen'

export function MaterialExamples() {
  const { t } = useTranslation()
  const [motion, setMotion] = useState(true)
  const [grain, setGrain] = useState('md')

  return (
    <>
      <Specimen
        name="Grain presets"
        description={t('library.materials.grainDescription')}
      >
        <div className="flex w-full flex-col gap-4">
          <div className="library-grain-grid">
            {(['xs', 'sm', 'md', 'lg'] as const).map(preset => (
              <button
                key={preset}
                className="library-grain-swatch"
                data-grain={preset}
                aria-pressed={grain === preset}
                onClick={() => setGrain(preset)}
              >
                <span className="font-mono text-[10px]">grain-{preset}</span>
                <span className="text-2xl">Aa</span>
                <span className="text-[10px] text-muted-foreground">
                  {t(`library.materials.${preset}`)}
                </span>
              </button>
            ))}
          </div>
          <div className="library-grain-sample" data-grain={grain}>
            <span>{t('library.materials.crispText')}</span>
            <span className="font-mono text-xs">grain-{grain}</span>
          </div>
          <p className="library-note">{t('library.materials.grainRoles')}</p>
        </div>
      </Specimen>
      <Specimen
        name="Splash & Shader"
        description={t('library.materials.shaderDescription')}
      >
        <div className="flex w-full flex-col gap-4">
          <SplashArtwork animated={motion} className="library-splash-preview" />
          <div className="flex flex-wrap items-center gap-3">
            <Switch
              id="library-shader-motion"
              checked={motion}
              onCheckedChange={setMotion}
            />
            <Label htmlFor="library-shader-motion">
              {t('library.materials.motion')}
            </Label>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Play data-icon="inline-start" />
                  {t('library.materials.replay')}
                </Button>
              </DialogTrigger>
              <DialogContent className="library-splash-dialog">
                <DialogHeader className="sr-only">
                  <DialogTitle>
                    {t('library.materials.splashPreview')}
                  </DialogTitle>
                  <DialogDescription>
                    {t('library.materials.shaderDescription')}
                  </DialogDescription>
                </DialogHeader>
                <SplashArtwork
                  animated={motion}
                  className="library-splash-preview"
                />
              </DialogContent>
            </Dialog>
            <FilterChip
              active={!motion}
              onClick={() => setMotion(value => !value)}
            >
              {motion ? (
                <Pause className="size-3" />
              ) : (
                <Play className="size-3" />
              )}
              {t(motion ? 'library.materials.pause' : 'library.materials.play')}
            </FilterChip>
          </div>
        </div>
      </Specimen>
    </>
  )
}
