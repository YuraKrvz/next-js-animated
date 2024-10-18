import { promises as fs } from 'fs'
import { NextResponse } from 'next/server'
import path from 'path'

// http://localhost:3000/api/users
// http://localhost:3000/api/users?filter[name]=

export async function GET(req: Request) {
  // Delay. Adjust delay as needed
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Get the file path
  const filePath = path.join(process.cwd(), 'data', 'users.txt')

  // Parse the query parameters
  const url = new URL(req.url)
  const personFilter = url.searchParams.get('filter[name]') // Get the 'filter[name]' parameter

  try {
    // Read the data from the file
    const data = await fs.readFile(filePath, 'utf-8')

    // Parse the data as JSON
    const users = JSON.parse(data)

    // If there's a filter, search for a matching user by name
    let filteredUsers = users

    if (personFilter) {
      filteredUsers = users.filter((user: any) =>
        user.name.toLowerCase().includes(personFilter.toLowerCase()),
      )
    }

    // Return the filtered users (or all users if no filter is applied)
    return NextResponse.json(filteredUsers)
  } catch (error) {
    console.error(error)
    // Return an error response if something went wrong
    return NextResponse.json({ error: 'Failed to load user data' }, { status: 500 })
  }
}
