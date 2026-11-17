import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="flex justify-center pt-10">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>SkillStreakr</CardTitle>
          <CardDescription>Track any skill, every day.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="skill">Skill name</Label>
          <Input id="skill" placeholder="e.g. JavaScript, Guitar, English" />
        </CardContent>
        <CardFooter className="gap-2">
          <Button>Start streak</Button>
          <Button variant="outline">Cancel</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
