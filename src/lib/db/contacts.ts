import { createClient } from '@/lib/supabase/server'

export interface Contact {
  id: string
  created_at: string
  full_name: string
  email: string
  phone: string | null
  message: string | null
  form_type: string | null
  property_id: string | null
  status: 'new' | 'contacted' | 'closed'
  notes: string | null
}

/**
 * Get all contacts ordered by most recent
 */
export async function getContacts(): Promise<{
  data: Contact[] | null
  error: any
}> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false })

  return { data, error }
}

/**
 * Create a new contact
 */
export async function createContact(contact: {
  full_name: string
  email: string
  phone?: string
  message?: string
  form_type?: string
  property_id?: string
}): Promise<{ data: Contact | null; error: any }> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('contacts')
    .insert({
      full_name: contact.full_name,
      email: contact.email,
      phone: contact.phone || null,
      message: contact.message || null,
      form_type: contact.form_type || null,
      property_id: contact.property_id || null,
      status: 'new',
    })
    .select()
    .single()

  return { data, error }
}

/**
 * Update contact status
 */
export async function updateContactStatus(
  id: string,
  status: 'new' | 'contacted' | 'closed'
): Promise<{ data: Contact | null; error: any }> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('contacts')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}

/**
 * Update contact notes
 */
export async function updateContactNotes(
  id: string,
  notes: string
): Promise<{ data: Contact | null; error: any }> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('contacts')
    .update({ notes })
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}
