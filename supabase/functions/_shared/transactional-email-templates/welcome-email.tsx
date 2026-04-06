/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "Cinely.AI"

interface WelcomeEmailProps {
  name?: string
}

const WelcomeEmail = ({ name }: WelcomeEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Welcome to {SITE_NAME} — let's create something amazing!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>
          Welcome to {SITE_NAME}! 🎨
        </Heading>
        <Text style={text}>
          {name ? `Hi ${name},` : 'Hi there,'}
        </Text>
        <Text style={text}>
          Thank you for using Cinely.AI. I'm excited to see what you can come up with.
          Feel free to reply back with any of your feedback — I'm always listening.
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          Best regards,{'\n'}The {SITE_NAME} Team
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: WelcomeEmail,
  subject: `Welcome to ${SITE_NAME}!`,
  displayName: 'Welcome email',
  previewData: { name: 'Jane' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', 'Space Grotesk', Arial, sans-serif" }
const container = { padding: '40px 25px' }
const h1 = { fontSize: '24px', fontWeight: '700' as const, color: '#1a1c1c', margin: '0 0 24px' }
const text = { fontSize: '15px', color: '#55575d', lineHeight: '1.6', margin: '0 0 16px' }
const hr = { borderColor: '#e5e5e5', margin: '24px 0' }
const footer = { fontSize: '13px', color: '#999999', margin: '0', whiteSpace: 'pre-line' as const }
