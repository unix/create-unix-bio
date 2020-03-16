import chalk from 'chalk'
import * as spinner from './spinner'

export const logColor = (text: string): string => {
  return chalk.hex('#bdbdbd')(text)
}

export const cyanColor = (text: string): string => {
  return chalk.cyanBright(text)
}

export const dangerColor = (text: string): string => {
  return chalk.redBright(text)
}

export const catchErr = (err: Error): void => {
  const msg = err.message || `${err}`
  spinner.fail()
  console.log(dangerColor(`> ${msg}`))
  process.exit(1)
}

export const promptText = (text: string): string => {
  text = text.replace('project name', chalk.bold('project name'))
  return logColor(text)
}

export const welcome = (): void => {
  const name = chalk.hex('#FEFEFE').bold('koa-ts')
  const text = chalk.hex('#F0F0F0')(`  Welcome to ${name} installer`)
  console.log(text)
  console.log('')
}
