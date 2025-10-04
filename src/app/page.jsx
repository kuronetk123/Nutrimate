import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChefHat, Sparkles, Clock, Utensils, ShoppingBag, Heart, ArrowRight, Users, Target } from 'lucide-react'

import { ContactSection } from '@/components/ContactSection'
import { Container } from '@/components/Container'
import { FadeIn, FadeInStagger } from '@/components/FadeIn'
import { List, ListItem } from '@/components/List'
import { SectionIntro } from '@/components/SectionIntro'
import { StylizedImage } from '@/components/StylizedImage'
import { Testimonial } from '@/components/Testimonial'
import logoBrightPath from '@/images/clients/bright-path/logo-light.svg'
import logoFamilyFund from '@/images/clients/family-fund/logo-light.svg'
import logoGreenLife from '@/images/clients/green-life/logo-light.svg'
import logoHomeWork from '@/images/clients/home-work/logo-light.svg'
import logoMailSmirk from '@/images/clients/mail-smirk/logo-light.svg'
import logoNorthAdventures from '@/images/clients/north-adventures/logo-light.svg'
import logoPhobiaDark from '@/images/clients/phobia/logo-dark.svg'
import logoPhobiaLight from '@/images/clients/phobia/logo-light.svg'
import logoUnseal from '@/images/clients/unseal/logo-light.svg'
import imageLaptop from '@/images/laptop.jpg'
import { loadCaseStudies } from '@/lib/mdx'

const clients = [
  ['Phobia', logoPhobiaLight],
  ['Family Fund', logoFamilyFund],
  ['Unseal', logoUnseal],
  ['Mail Smirk', logoMailSmirk],
  ['Home Work', logoHomeWork],
  ['Green Life', logoGreenLife],
  ['Bright Path', logoBrightPath],
  ['North Adventures', logoNorthAdventures],
]

function Clients() {
  return (
    <div className="mt-16 rounded-4xl bg-neutral-950 py-16 sm:mt-20 sm:py-20 lg:mt-32">
      <Container>
        <FadeIn className="flex items-center gap-x-8">
          <h2 className="text-center font-display text-sm font-semibold tracking-wider text-white sm:text-left">
            Trusted by meal planners and food lovers everywhere
          </h2>
          <div className="h-px flex-auto bg-neutral-800" />
        </FadeIn>
        <FadeInStagger faster>
          <ul
            role="list"
            className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4"
          >
            {clients.map(([client, logo]) => (
              <li key={client}>
                <FadeIn>
                  <Image src={logo} alt={client} unoptimized />
                </FadeIn>
              </li>
            ))}
          </ul>
        </FadeInStagger>
      </Container>
    </div>
  )
}

function CaseStudies({ caseStudies }) {
  return (
    <>
      <SectionIntro
        title="Meal planning made simple"
        className="mt-16 sm:mt-20 lg:mt-24"
      >
        <p>
          Discover how our users save time, eat healthier, and enjoy stress-free meals with our intuitive meal planning tools.
        </p>
      </SectionIntro>
      <Container className="mt-12">
        <FadeInStagger className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {caseStudies.map((caseStudy) => (
            <FadeIn key={caseStudy.href} className="flex">
              <article className="relative flex w-full flex-col rounded-3xl p-6 ring-1 ring-neutral-950/5 transition hover:bg-neutral-50 sm:p-8">
                <h3>
                  <Link href={caseStudy.href}>
                    <span className="absolute inset-0 rounded-3xl" />
                    <Image
                      src={caseStudy.logo}
                      alt={caseStudy.client}
                      className="h-16 w-16"
                      unoptimized
                    />
                  </Link>
                </h3>
                <p className="mt-6 flex gap-x-2 text-sm text-neutral-950">
                  <time
                    dateTime={caseStudy.date.split('-')[0]}
                    className="font-semibold"
                  >
                    {caseStudy.date.split('-')[0]}
                  </time>
                  <span className="text-neutral-300" aria-hidden="true">
                    /
                  </span>
                  <span>Success story</span>
                </p>
                <p className="mt-6 font-display text-2xl font-semibold text-neutral-950">
                  {caseStudy.title}
                </p>
                <p className="mt-4 text-base text-neutral-600">
                  {caseStudy.description}
                </p>
              </article>
            </FadeIn>
          ))}
        </FadeInStagger>
      </Container>
    </>
  )
}

function Services() {
  return (
    <>
      <SectionIntro
        eyebrow="Features"
        title="Everything you need for effortless meal planning"
        className="mt-16 sm:mt-20 lg:mt-24"
      >
        <p>
          Plan your week, discover new recipes, and generate shopping lists in seconds. Our platform is designed to make healthy eating easy and enjoyable.
        </p>
      </SectionIntro>
      <Container className="mt-12">
        <div className="lg:flex lg:items-center lg:justify-end">
          <div className="flex justify-center lg:w-1/2 lg:justify-end lg:pr-12">
            <FadeIn className="w-[33.75rem] flex-none lg:w-[45rem]">
              <div className="relative">
                <Image
                  src="/homepage/12.png"
                  alt="Healthy food preparation scene"
                  width={720}
                  height={480}
                  className="rounded-3xl object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-3xl"></div>
              </div>
            </FadeIn>
          </div>
          <List className="mt-12 lg:mt-0 lg:w-1/2 lg:min-w-[33rem] lg:pl-4">
            <ListItem title="Personalized meal plans">
              Get meal plans tailored to your dietary preferences, allergies, and goals.
            </ListItem>
            <ListItem title="Smart grocery lists">
              Automatically generate organized shopping lists based on your weekly plan.
            </ListItem>
            <ListItem title="Recipe discovery">
              Explore a curated library of healthy, delicious recipes for every taste.
            </ListItem>
            <ListItem title="Nutrition tracking">
              Monitor your nutritional intake and stay on track with your health objectives.
            </ListItem>
          </List>
        </div>
      </Container>
    </>
  )
}

export const metadata = {
  description:
    'Plan your meals, discover recipes, and simplify your grocery shopping with our all-in-one meal planning platform.',
}

function HeroSection() {
  return (
    <div className="min-h-[70vh] flex">
      {/* Left side - Dark background with text */}
      <div className="flex-1 bg-neutral-900 flex items-center">
        <Container className="py-12">
          <FadeIn className="max-w-2xl">
            <div className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-3">
              NUTRITION TRACKING & BEYOND
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-6xl leading-tight">
              Loaded with features to support your unique health journey
            </h1>
            <p className="mt-6 text-lg text-neutral-300 leading-relaxed">
              With Nutrimate, you get a best-in-class nutrition tracking app that's accurate, reliable, and purpose-built to fast-track you toward better health.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold">
                <Link href="/cong-thuc/aiSuggest">
                  Sign Up For Free
                </Link>
              </Button>
            </div>
          </FadeIn>
        </Container>
      </div>
      
      {/* Right side - Lifestyle image with curved edge */}
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0">
          {/* Main food image with curved left edge */}
          <div className="absolute inset-0">
            <Image
              src="/homepage/cooking-terms.jpg"
              alt="Healthy cooking scene"
              fill
              className="object-cover"
              style={{
                clipPath: 'polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)'
              }}
            />
          </div>
          
          {/* Concentric rings overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-96 h-96">
              {/* Ring 1 - Outer */}
              <div className="absolute inset-0 border-4 border-orange-300 rounded-full opacity-60"></div>
              {/* Ring 2 - Middle */}
              <div className="absolute inset-4 border-3 border-orange-400 rounded-full opacity-70"></div>
              {/* Ring 3 - Inner */}
              <div className="absolute inset-8 border-2 border-orange-500 rounded-full opacity-80"></div>
              {/* Ring 4 - Center */}
              <div className="absolute inset-12 border border-orange-600 rounded-full opacity-90"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TrackFoodSection() {
  return (
    <div className="bg-white py-20">
      <Container>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Text content */}
          <div className="space-y-6">
            <FadeIn>
              <div className="text-sm font-bold text-gray-600 uppercase tracking-wider">
                TRACK FOOD
              </div>
              <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                A powerfully accurate nutrition tracker
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Scan a barcode or enter food to easily track your calories and up to 84 other nutrients with data you can trust.
              </p>
              <Button variant="ghost" className="p-0 h-auto font-bold text-gray-900 text-lg hover:text-green-600 transition-colors">
                LEARN MORE
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </FadeIn>
          </div>

          {/* Right side - Image with overlay */}
          <FadeIn className="relative">
            <div className="relative">
              <Image
                src="/homepage/6.png"
                alt="Healthy food bowl with nutrition tracking"
                width={600}
                height={400}
                className="rounded-3xl object-cover shadow-2xl"
              />
              
              {/* Nutrition tracker overlay */}
              <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl max-w-xs">
                <h3 className="font-bold text-gray-900 mb-4">Nutrition Tracker</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Protein</span>
                    <span className="text-sm font-semibold">115/125g</span>
                    <span className="text-sm text-green-600">90%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gray-600 h-2 rounded-full" style={{width: '90%'}}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Vitamin C</span>
                    <span className="text-sm font-semibold">755/755mg</span>
                    <span className="text-sm text-green-600">100%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '100%'}}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Magnesium</span>
                    <span className="text-sm font-semibold">200/320mg</span>
                    <span className="text-sm text-gray-600">63%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gray-600 h-2 rounded-full" style={{width: '63%'}}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Calcium</span>
                    <span className="text-sm font-semibold">500/1000mg</span>
                    <span className="text-sm text-gray-600">50%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gray-600 h-2 rounded-full" style={{width: '50%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </Container>
    </div>
  )
}

function FeatureCards() {
  return (
    <div className="bg-gradient-to-br from-neutral-50 to-white py-16">
      <Container>
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left side - Feature cards */}
          <div className="space-y-4">
            {/* First feature card */}
            {/* <FadeIn className="group">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-neutral-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-blue-50 shadow-md">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                    INTEGRATE
                  </span>
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-3 leading-tight">
                  Sync with popular apps and devices
                </h3>
                <p className="text-neutral-600 mb-4 leading-relaxed text-sm">
                  Easily sync with other apps and devices to get a holistic view of your health.
                </p>
                <Button variant="ghost" className="group-hover:text-blue-600 transition-all duration-300 p-0 h-auto font-bold text-neutral-900 text-sm">
                  LEARN MORE
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              </div>
            </FadeIn> */}

            {/* Second feature card */}
            <FadeIn className="group">
              <div className="bg-white rounded-2xl p-4 shadow-lg border border-neutral-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-green-50 shadow-md">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-xs font-bold text-green-600 uppercase tracking-widest">
                    OVERALL HEALTH
                  </span>
                </div>
                <h3 className="text-base font-bold text-neutral-900 mb-2 leading-tight">
                  Track exercise and other health metrics
                </h3>
                <p className="text-neutral-600 mb-3 leading-relaxed text-sm">
                  Gain a complete understanding of your health with an app that tracks exercise, weight and so many other health metrics.
                </p>
                <Button variant="ghost" className="group-hover:text-green-600 transition-all duration-300 p-0 h-auto font-bold text-neutral-900 text-sm">
                  LEARN MORE
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              </div>
            </FadeIn>

            {/* Third feature card */}
            <FadeIn className="group">
              <div className="bg-white rounded-2xl p-4 shadow-lg border border-neutral-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-purple-50 shadow-md">
                    <Utensils className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">
                    ANY DIET
                  </span>
                </div>
                <h3 className="text-base font-bold text-neutral-900 mb-2 leading-tight">
                  Custom tracking specific to your diet
                </h3>
                <p className="text-neutral-600 mb-3 leading-relaxed text-sm">
                  Keto, vegan, and beyond, embrace your unique diet with an adaptable solution.
                </p>
                <Button variant="ghost" className="group-hover:text-purple-600 transition-all duration-300 p-0 h-auto font-bold text-neutral-900 text-sm">
                  LEARN MORE
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              </div>
            </FadeIn>
          </div>

          {/* Right side - Healthy eating scene */}
          <FadeIn className="relative">
            <div className="grid grid-cols-3 gap-3 h-[400px]">
              {/* First image */}
              <div className="bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/homepage/9.png"
                  alt="Colorful healthy food bowl with fresh ingredients"
                  fill
                  className="object-cover object-center"
                />
                {/* Subtle overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
              </div>
              
              {/* Second image */}
              <div className="bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/homepage/2.png"
                  alt="Healthy eating planning scene"
                  fill
                  className="object-cover object-center"
                />
                {/* Subtle overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
              </div>
              
              {/* Third image */}
              <div className="bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/homepage/9.png"
                  alt="Colorful healthy food bowl with fresh ingredients"
                  fill
                  className="object-cover object-center"
                />
                {/* Subtle overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
              </div>
            </div>
          </FadeIn>
        </div>
      </Container>
    </div>
  )
}

export default async function Home() {
  let caseStudies = (await loadCaseStudies()).slice(0, 3)

  return (
    <>
      <HeroSection />
      
      <TrackFoodSection />
      
      <FeatureCards />

      <Clients />

      <Testimonial
        className="mt-12 sm:mt-16 lg:mt-20"
        client={{ name: 'Phobia', logo: logoPhobiaDark }}
      >
        Our meal planner adapts to your preferences, dietary needs, and cooking skills. Whether you're vegan, keto, or just looking for variety — we make healthy eating easy.
      </Testimonial>

      <Services />

    </>
  )
}
