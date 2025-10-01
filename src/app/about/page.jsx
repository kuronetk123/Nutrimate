import Image from 'next/image'

import { Border } from '@/components/Border'
import { ContactSection } from '@/components/ContactSection'
import { Container } from '@/components/Container'
import { FadeIn, FadeInStagger } from '@/components/FadeIn'
import { GridList, GridListItem } from '@/components/GridList'
import { PageIntro } from '@/components/PageIntro'
import { PageLinks } from '@/components/PageLinks'
import { SectionIntro } from '@/components/SectionIntro'
import { StatList, StatListItem } from '@/components/StatList'

import imageThang from '@/images/team/Thang.png'
import imageQuyen from '@/images/team/DoQuyen.png'
import imageNam from '@/images/team/Nam.jpg'
import imageHai from '@/images/team/ChuHai.jpeg'
import imagetrinh from '@/images/team/trinh.jpg'

import { loadArticles } from '@/lib/mdx'

function Culture() {
  return (
    <div className="mt-24 rounded-4xl bg-neutral-950 py-24 sm:mt-32 lg:mt-40 lg:py-32">
      <SectionIntro
        eyebrow="Our values"
        title="Empowering healthy eating, every day."
        invert
      >
        <p>
          We are passionate about making nutritious meal planning simple, accessible, and enjoyable for everyone.
        </p>
      </SectionIntro>
      <Container className="mt-16">
        <GridList>
          <GridListItem title="Personalization" invert>
            Every meal plan is tailored to your unique tastes, goals, and lifestyle.
          </GridListItem>
          <GridListItem title="Simplicity" invert>
            We believe healthy eating should be easy and stress-free, not complicated.
          </GridListItem>
          <GridListItem title="Support" invert>
            Our team is here to guide and motivate you on your wellness journey.
          </GridListItem>
        </GridList>
      </Container>
    </div>
  )
}

const team = [
  {
    title: 'Leadership',
    people: [
      {
        name: 'Lê Quốc Thắng ',
        role: 'CEO',
        image: { src: imageThang },
      },
      {
        name: 'Phan Thị Đỗ Quyên',
        role: 'COO',
        image: { src: imageQuyen },
      },
      {
        name: 'Nguyễn Vũ Ánh Như',
        role: 'CMO',
        image: { src: imageQuyen },
      },
    ],
  },
  {
    title: 'Team',
    people: [
      {
        name: 'Nguyễn Thị Phương Trinh',
        role: 'CDO',
        image: { src: imagetrinh },
      },
      {
        name: 'Nguyễn Diễm Quyên',
        role: 'CFO',
        image: { src: imagetrinh },
      },
      {
        name: 'Phạm Lê Hoàng Nam',
        role: 'CTO',
        image: { src: imageNam },
      },
      {
        name: 'Phạm Duy Khánh',
        role: 'Developer',
        image: { src: imageHai },
      },
      // {
      //   name: 'Kathryn Murphy',
      //   role: 'VP, Human Resources',
      //   image: { src: imageKathrynMurphy },
      // },
      // {
      //   name: 'Whitney Francis',
      //   role: 'Content Specialist',
      //   image: { src: imageWhitneyFrancis },
      // }
    ],
  },
]

function Team() {
  return (
    <Container className="mt-24 sm:mt-32 lg:mt-40">
      <div className="space-y-24">
        {team.map((group) => (
          <FadeInStagger key={group.title}>
            <Border as={FadeIn} />
            <div className="grid grid-cols-1 gap-6 pt-12 sm:pt-16 lg:grid-cols-4 xl:gap-8">
              <FadeIn>
                <h2 className="font-display text-2xl font-semibold text-neutral-950">
                  {group.title}
                </h2>
              </FadeIn>
              <div className="lg:col-span-3">
                <ul
                  role="list"
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8"
                >
                  {group.people.map((person) => (
                    <li key={person.name}>
                      <FadeIn>
                        <div className="group relative overflow-hidden rounded-3xl bg-neutral-100">
                          <Image
                            alt=""
                            {...person.image}
                            className="h-96 w-full object-cover grayscale transition duration-500 motion-safe:group-hover:scale-105"
                          />
                          <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black to-black/0 to-40% p-6">
                            <p className="font-display text-base/6 font-semibold tracking-wide text-white">
                              {person.name}
                            </p>
                            <p className="mt-2 text-sm text-white">
                              {person.role}
                            </p>
                          </div>
                        </div>
                      </FadeIn>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeInStagger>
        ))}
      </div>
    </Container>
  )
}


export default async function About() {
  let blogArticles = (await loadArticles()).slice(0, 2)

  return (
    <>
      <PageIntro eyebrow="About us" title="Empowering healthy eating, every day">
        <p>
          Nutrimate is dedicated to making nutritious meal planning simple, accessible, and enjoyable for everyone.
        </p>
        <div className="mt-10 max-w-2xl space-y-6 text-base">
          <p>
            Our journey began with a shared passion for health and wellness. We noticed how challenging it can be to maintain a balanced diet amidst busy schedules and endless food choices.
          </p>
          <p>
            That’s why we created Nutrimate — to help you discover, plan, and enjoy meals that fit your unique lifestyle and goals. Our team combines expertise in nutrition, technology, and design to deliver a seamless meal planning experience.
          </p>
        </div>
      </PageIntro>
      <Container className="mt-16">
        <StatList>
          <StatListItem value="10K+" label="Personalized meal plans created" />
          <StatListItem value="5K+" label="Happy users" />
          <StatListItem value="1M+" label="Healthy meals served" />
        </StatList>
      </Container>

      <Culture />

      <Team />

      <PageLinks
        className="mt-24 sm:mt-32 lg:mt-40"
        title="From the blog"
        intro="Explore tips, recipes, and stories from our team to inspire your healthy eating journey."
        pages={blogArticles}
      />

      <ContactSection className="mb-20" />
    </>
  )
}
