import fs from 'fs-extra'
import path from 'path'
import promptSync from 'prompt-sync'
import gitClone from 'git-clone'
import { CommandMajor } from 'func'
import * as print from '../utils/print'
import * as spinner from '../utils/spinner'

const ignoreFiles = [
  'cli',
  '.git',
  '.circle.yml',
  '.travis.yml',
  '.github',
  'now.json',
]

@CommandMajor()
export class Major {
  private projectName: string
  private projectPath: string
  
  constructor() {
    print.welcome()
    this.input()
      .then(() => this.install())
      .then(() => this.after())
      .catch(print.catchErr)
  }
  
  async input(): Promise<void> {
    const getProject = (reuqired: boolean = false) => {
      const prompt = promptSync()
      const str = print.promptText(`> You need to specify the project name${reuqired ? '(required)' : ''}: `)
      let project = prompt(str)
      if (project === null) throw new Error('About. Nothing has changed.')
      if (!project) project = getProject(true)
      return project
    }
    const project = getProject()
    this.projectPath = path.join(process.cwd(), project)
    if (fs.existsSync(this.projectPath)) throw new Error(`Abort, "${project}" already exists. Nothing has changed.`)
    this.projectName = project
  }
  
  async install(): Promise<void> {
    spinner.start('template installing...')
    return new Promise((resolve, reject) => {
      gitClone(
        'https://github.com/unix/unix.bio',
        this.projectPath,
        { shallow: true },
        (err) => {
          if (err) return reject(new Error(`About. ${err}`))
          spinner.succeed(true)
          spinner.start('Installed, enjoy!')
          spinner.succeed()
          console.log('')
          resolve()
        },
      )
    })
  }
  
  async after(): Promise<void> {
    await Promise.all(ignoreFiles.map(async name => {
      const ignorePath = path.join(this.projectPath, name)
      await fs.remove(ignorePath)
    }))
    
    const pkgPath = path.join(this.projectPath, 'package.json')
    if (!fs.existsSync(pkgPath)) return
    let pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
    pkg = Object.assign(pkg, {
      name: this.projectName,
      version: '0.0.1',
    })
    delete pkg.author
    delete pkg.bugs
    delete pkg.description
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
  }
  
}
