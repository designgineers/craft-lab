import { Radio, RadioGroup } from '@headlessui/react'
import {
	type MetaFunction,
	json,
	type ActionFunctionArgs,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import Alea from 'alea'
import clsx from 'clsx'
import {
	type ComponentProps,
	useState,
	type PropsWithChildren,
	useMemo,
	useEffect,
} from 'react'
import { getHighlighter } from 'shiki'
import { createNoise2D } from 'simplex-noise'
import { RefreshIcon } from '#app/components/two-tone-icon.js'
import { Icon } from '#app/components/ui/icon.js'
import { WaitlistForm } from '#app/components/waitlist.js'
import { seoData } from '#app/utils/seo.js'
import { theme } from '#app/utils/shiki.js'
import { submitWaitlist } from '#app/utils/waitlist.server.js'

export const meta: MetaFunction = () => [
	...seoData({
		title: 'The Generative Part of Generative Art - Craft Lab',
		description:
			'An interactive guide sharing what I have learned about Generative Art to help you go from zero to one faster.',
		image:
			'https://res.cloudinary.com/dzqdvin5s/image/upload/v1714586250/generative-part-og.jpg',
	}),
	{
		'script:ld+json': {
			'@context': 'https://schema.org',
			'@type': 'Article',
			name: 'The Generative Part of Generative Art',
			author: {
				'@type': 'Person',
				name: 'Will King',
			},
			datePublished: '2024-05-01',
			description:
				'An interactive guide sharing what I have learned about Generative Art to help you go from zero to one faster.',
			publisher: {
				'@type': 'Organization',
				name: 'Craft Lab',
				logo: {
					'@type': 'ImageObject',
					url: 'https://res.cloudinary.com/dzqdvin5s/image/upload/v1714587213/craft-lab-icon.png',
				},
			},
			mainEntityOfPage: {
				'@type': 'WebPage',
				'@id':
					'https://www.craftlab.fun/articles/the-generative-part-of-generative-art',
			},
		},
	},
]

export async function loader() {
	const highlighter = await getHighlighter({
		themes: [theme],
		langs: ['typescript', 'tsx'],
	})

	return json({
		exampleOne: highlighter.codeToHtml(exampleOne, {
			lang: 'tsx',
			theme,
		}),
		exampleTwo: highlighter.codeToHtml(exampleTwo, {
			lang: 'tsx',
			theme,
		}),
		exampleThree: highlighter.codeToHtml(exampleThree, {
			lang: 'tsx',
			theme,
		}),
		exampleFour: highlighter.codeToHtml(exampleFour, {
			lang: 'tsx',
			theme,
		}),
		exampleSix: highlighter.codeToHtml(exampleSix, {
			lang: 'tsx',
			theme,
		}),
	})
}

export async function action({ request }: ActionFunctionArgs) {
	return submitWaitlist({ request })
}

export default function Screen() {
	const { exampleOne, exampleTwo, exampleThree, exampleFour, exampleSix } =
		useLoaderData<typeof loader>()
	const [exampleFontSize, setExampleFontSize] = useState<
		'text-sm' | 'text-base' | 'text-lg'
	>('text-sm')

	return (
		<article className="prose prose-sm mx-auto px-4 py-8 md:prose-base prose-headings:font-semibold prose-p:text-pretty prose-p:text-foreground/70 hover:prose-a:text-lime md:py-16 lg:py-24 lg:text-lg prose-h1:lg:text-5xl">
			<div className="flex items-center gap-2 font-mono text-sm">
				<p className="">
					<time dateTime="05-01-2024">May 1, 2024</time>
				</p>
				<div className="ml-2 h-px w-6 bg-foreground" />
				<div className="mr-2 h-px w-2 bg-foreground" />
				<p>Will King</p>
				<p className="not-prose">
					<a
						className="-m-1 px-2 pb-1 pt-0.5 hover:bg-gray-100"
						href="https://x.com/wking__"
					>
						<span className="sr-only">X Profile</span>
						<Icon name="x" size="xs" />
					</a>
				</p>
			</div>
			<h1 className="mt-4 md:mt-12 lg:mt-16">
				The Generative Part of Generative <span className="sr-only">Art</span>
				<Art />
			</h1>
			<p>
				Part of the creation of the Craft Lab brand has involved generative
				elements. I have always been interested in them, and a community
				platform built for design engineers felt like the perfect opportunity to
				explore and enforce my experience with generative art.
			</p>
			<p>
				After building multiple pieces of generative art I want to document what
				I have learned so that if this is something you are interested in
				exploring maybe this will expedite your understanding.
			</p>
			<h2>Random Values</h2>
			<p>
				What makes generative art…well generative? The idea is that by using
				some source of randomized data, usually in the form of numbers, and
				applying it to a visual algorithm you can create unique and interesting
				art that changes every time the underlying data changes.
			</p>

			<p>
				A Visual Algorithm is just an easier way to refer to the function (or
				functions) that you use to take in randomized data, apply some rules to
				that data, and output a designed visual that reacts to the data.
			</p>
			<p>
				There is a lot to unpack in what I just said, and that is what we are
				here to do. We are going to break down what it means to build a visual
				algorithm down the most basic example I can think of. Then build on top
				of that to slowly introduce more concepts that make a complete visual
				algorithm.
			</p>
			<h2>Applying Values to Visuals</h2>
			<p>Let's start by applying a random value to a single visual output.</p>

			<p>
				We will do this using JavaScript’s built-in random number function{' '}
				<Code>Math.random()</Code> to pick a single color.
			</p>

			<CodeBlock
				size={exampleFontSize}
				setSize={setExampleFontSize}
				code={exampleOne}
			/>

			<DemoOne />

			<p>BOOM! Generative art.</p>

			<h3>Let’s take it a little further</h3>

			<p>
				We implemented randomized color selection, but what if we want to do
				more than one color? What if we want a grid of colors where the size of
				that grid is also generative?
			</p>
			<CodeBlock
				size={exampleFontSize}
				setSize={setExampleFontSize}
				code={exampleTwo}
			/>

			<DemoTwo />

			<p>
				Okay, now we're cooking! We have color generation and size generation.
				However, just because we are generating randomized values that are
				influencing our output the question is:
			</p>
			<blockquote>Is this good?</blockquote>
			<p>No. The answer is no.</p>
			<h2>Constraints Breed Craft</h2>
			<p>
				Objectively speaking it isn't anything special, yet. It has allowed us
				to learn some important concepts and is interesting, but, as with a lot
				of great art and design, it is missing constraints. Constraints breed
				craft. They allow you to guide the randomness of generative art in a way
				that keeps what is interesting while still controlling the visual output
				to fit within a pattern that will resonate with you and the people
				viewing your art.
			</p>
			<h3>Color Constraint</h3>
			<p>
				Let's look at how we can use constraints on a single dimension &mdash;
				color. We will use two different methods to get two very different
				outputs.
			</p>
			<p>
				In the example that we have been building so far the color for each
				square is completely random. It could be any of the available colors.
				How can we take the idea of constraint to increase the quality of the
				art that our visual algorithm is creating?
			</p>
			<p>
				There are a lot of approaches we could take, but a common approach to
				more visually pleasing color is using a gradient. Instead of complete
				chaos, we can add a feeling of flows moving from one side to another by
				limiting what colors are available based on the x and y coordinates of
				the pixel being rendered.
			</p>

			<p>
				So, let’s update our visual algorithm so that the output has cooler
				colors in the top left and moves to warmer colors in the bottom right.
			</p>

			<CodeBlock
				size={exampleFontSize}
				setSize={setExampleFontSize}
				code={exampleThree}
			/>

			<DemoThree />

			<p>
				Okay, now the output of our visual algorithm is feeling more intentional
				and designed. With this approach, we manually hardcoded our available
				values at each stage of the gradient. However, as you introduce more
				complex variables like distance or size in your work how can we add
				constraints without needing to manually enter and control every
				available value?
			</p>

			<h3>Pattern Algorithms</h3>

			<p>
				In generative art, there is a large set of common visual and
				mathematical algorithms that allow you to create patterns that have a
				feeling of intention and direction by adding constraints to the
				randomness in your work.
			</p>

			<p>Here is a list of some commonly used ones:</p>

			<ul>
				<li>Simplex / Perlin Noise</li>
				<li>Fibonacci Sequence</li>
				<li>L-System</li>
				<li>Truchet Tiles</li>
			</ul>

			<p>
				There is a wide world of available pattern algorithms to experiment
				with. I'm not kidding. There is{' '}
				<a href="https://www.mattdesl.com/sferics">
					literally a wide world of natural patterns
				</a>{' '}
				that you can draw inspiration from.
			</p>

			<p>
				For demonstration let me show you how we can use Simplex Noise in the
				example we have been building vs manually grouping colors.
			</p>

			<Callout>
				Simplex Noise is an algorithm created by Ken Perlin. It is most commonly
				used in video game topography and generative art…obviously.
			</Callout>

			<CodeBlock
				size={exampleFontSize}
				setSize={setExampleFontSize}
				code={exampleFour}
			/>

			<DemoFour />

			<p>
				By substituting our <Code>Math.random()</Code> value out with a value
				generated from our simplex algorithm we have enforced a constraint that
				is apparent in the colors selected across the coordinates of our visual
				algorithms output.
			</p>

			<p>
				The smoothness controls allow us to change the scale at which our noise
				is changing. If you drag the smoothness to the far left you will be able
				to see what the output looks like with the raw noise values. Since the
				noise is changing so quickly at that scale it looks barely better than
				completely random values.
			</p>

			<h2>Random, but Repeatable</h2>

			<p>
				As I close out this article there is one more VERY important detail.
				What happens in the examples above when you hit the refresh button? You
				get a brand new output!
			</p>
			<p>
				What if when you press the button you like the output? What happens if
				your dev environment crashes or your browser tab gets closed?
			</p>
			<p>
				That version that you liked is gone. Most likely forever because of the
				probabilities of so many completely random values being used.
			</p>

			<p>
				So the question is, how to generate art that is random, but repeatable?
			</p>

			<h3>The Mighty Seed</h3>
			<p>
				In generative art, the ability to create repeatable outputs is captured
				in two concepts. A Pseudo Random Number Generator (PRNG) and a seed.
			</p>
			<p>
				A PRNG is exactly like it sounds. It is an algorithm (like{' '}
				<Code>Math.random()</Code> under the hood) that outputs a randomized
				number.
			</p>
			<p>
				However, the big difference between <Code>Math.random()</Code> and using
				a “real” PRNG is the ability to accept a seed.
			</p>
			<p>
				A seed is just a number that we pass to the PRNG that guarantees that
				the numbers that are output are always the same. Let’s take an
				interactive look at this concept.
			</p>
			<p>
				The example below uses the Alea PRNG, and when we pass the same seed you
				can see that the first four generated numbers will always be the same.
				Try changing the numbers around and matching them back up.
			</p>

			<DemoFive />

			<p>
				See? Repeatable randomness. This means we can save and track inputs that
				make great outputs. Let's implement seeding with our latest example for
				our color grid that is using simplex noise.
			</p>

			<CodeBlock
				size={exampleFontSize}
				setSize={setExampleFontSize}
				code={exampleSix}
			/>

			<DemoSix />

			<h2>Go Forth and Generate</h2>
			<p>
				That wraps it up. What we have covered here is enough for you to go and
				get started making generative art.
			</p>
			<p>
				The only real way to make great visual algorithms at this point is to
				get out there and start building! You will learn so much when you try to
				make your first one. If you would like to dive a little deeper, I have
				added some extra resources and topics below that will help you expand
				your capability to create visual algorithms.
			</p>
			<Callout>
				<h2 className="!mb-3 !mt-0">
					Your friends are your future.
					<br />
					Come make more Design Engineer ones.
				</h2>
				<p className="!mb-0">
					Get updates when more content like this is released, as well as early
					access news on the Craft Lab community by signing up below.
				</p>
				<div className="not-prose text-base">
					<WaitlistForm className="mt-6" />
				</div>
			</Callout>
			<div className="mt-16 flex items-center gap-3">
				<div className="h-px w-16 bg-foreground md:-ml-10 lg:-ml-12" />
				<div className=" h-px w-4 bg-foreground" />
				<div className=" h-px w-1 bg-foreground" />
			</div>
			<h2>More Resources:</h2>
			<div className="grid lg:grid-cols-2">
				<div>
					<h3 className="text-lg">Concepts</h3>
					<ul>
						<li className="font-mono text-xs">
							<a href="https://tylerxhobbs.com/essays/2016/working-with-color-in-generative-art">
								Working With Color in Generative Art
							</a>
						</li>
						<li className="font-mono text-xs">
							<a href="https://tylerxhobbs.com/essays/2021/color-arrangement-in-generative-art">
								Color Arrangement in Generative Art
							</a>
						</li>
						<li className="font-mono text-xs">
							<a href="https://www.gorillasun.de/blog/style-in-generative-art/">
								Personal Style
							</a>
						</li>
						<li className="font-mono text-xs">
							Pattern Algorithms (Coming Soon)
						</li>
					</ul>
				</div>
				<div>
					<h3 className="text-lg">Creators</h3>
					<ul>
						<li className="font-mono text-xs">
							<a href="https://twitter.com/tylerxhobbs">Tyler Hobbs</a>
						</li>
						<li className="font-mono text-xs">
							<a href="https://twitter.com/mattdesl">Matt DesLauriers</a>
						</li>
						<li className="font-mono text-xs">
							<a href="https://twitter.com/sasj_nl">Saskia Freeke</a>
						</li>
						<li className="font-mono text-xs">
							<a href="https://twitter.com/zachlieberman">Zach Liebermann</a>
						</li>
						<li className="font-mono text-xs">
							<a href="https://twitter.com/gorillasu">Gorilla Sun</a>
						</li>
					</ul>
				</div>
				<div>
					<h3 className="text-lg">Misc.</h3>
					<ul>
						<li className="font-mono text-xs">
							<a href="https://www.gorillasun.de/blog/3-generative-artists-3-principles">
								3 Generative Artists - Iterating, Mindset, and First Principles
							</a>
						</li>
						<li className="font-mono text-xs">
							<a href="https://www.gorillasun.de/blog/3-generative-artists-3-pieces-of-advice/">
								3 Generative Artists - Consistency and Momentum
							</a>
						</li>
					</ul>
				</div>
			</div>
		</article>
	)
}

/**
 * COMPONENTS
 */
function Art() {
	const xSmoothness = 10
	const ySmoothness = 10
	const [useRandom, setUseRandom] = useState(false)
	const noise2D = useMemo(() => {
		return createNoise2D(useRandom ? Math.random : () => 0.26)
	}, [useRandom])

	useEffect(() => {
		setTimeout(() => setUseRandom(true), 500)
	}, [])

	return (
		<svg
			id="craft-lab-logo"
			viewBox="0 0 17 8"
			width="17"
			height="8"
			xmlns="http://www.w3.org/2000/svg"
			className="-mt-2 ml-1 inline-block h-auto w-20"
		>
			{coordinates.map(([y, x]) => {
				return (
					<NoiseRect
						x={x}
						y={y}
						colors={simpleColorsFill}
						noise={noise2D(x / xSmoothness, y / ySmoothness)}
						width="1"
						height="1"
						key={`art-pixel-${x}-${y}`}
					/>
				)
			})}
		</svg>
	)
}

function DemoWrapper({
	children,
	onClick,
	className = '',
}: PropsWithChildren<{ onClick(): void; className?: string }>) {
	return (
		<div
			className={clsx(
				className,
				'relative flex items-center justify-center rounded-xl border border-gray-200 bg-gray-100 p-12 md:-mx-10 lg:-mx-12',
			)}
		>
			{children}
			<button
				onClick={onClick}
				className="group absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 font-mono text-xs hover:bg-gray-200"
			>
				<svg
					className="absolute -right-px -top-px h-[24px] w-[24px] rotate-0"
					viewBox="0 0 4 4"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<rect
						className="fill-transparent group-hover:fill-gray-100"
						x="0"
						y="0"
						width="4"
						height="4"
					/>
					<path
						d="M 0 0 H 2 V 1 H 3 V 2 H 4 V 4 H 0 V 0 Z"
						className="fill-transparent group-hover:fill-gray-200"
					/>
				</svg>
				<span>Refresh</span>
				<span className="h-auto w-4 transition group-hover:rotate-90">
					<RefreshIcon />
				</span>
			</button>
		</div>
	)
}

function DemoOne() {
	const [color, setColor] = useState(simpleColorsBg[0])

	return (
		<DemoWrapper
			className="min-h-64"
			onClick={() => setColor(generateColor(Math.random, simpleColorsBg))}
		>
			<div className={clsx(color, 'h-12 w-12')} />
		</DemoWrapper>
	)
}

function DemoTwo() {
	const [rows, setRows] = useState(createArrayOfLength(75))
	const [columns, setColumns] = useState(createArrayOfLength(37))
	const boxSize = 6

	return (
		<DemoWrapper
			className="min-h-96"
			onClick={() => {
				setRows(
					createArrayOfLength(getRandomPositiveIntWithin(Math.random, 100)),
				)
				setColumns(
					createArrayOfLength(getRandomPositiveIntWithin(Math.random, 40)),
				)
			}}
		>
			<svg
				width={rows.length * boxSize}
				height={columns.length * boxSize}
				viewBox={`0 0 ${rows.length} ${columns.length}`}
			>
				{rows.map(x =>
					columns.map(y => (
						<ColorRect
							x={x}
							y={y}
							colors={simpleColorsFill}
							width="1"
							height="1"
							key={`demo-2-pixel-${x}-${y}`}
						/>
					)),
				)}
			</svg>
		</DemoWrapper>
	)
}

function DemoThree() {
	const [rows, setRows] = useState(createArrayOfLength(63))
	const [columns, setColumns] = useState(createArrayOfLength(24))
	const boxSize = 6

	return (
		<DemoWrapper
			className="min-h-96"
			onClick={() => {
				setRows(
					createArrayOfLength(getRandomPositiveIntWithin(Math.random, 100)),
				)
				setColumns(
					createArrayOfLength(getRandomPositiveIntWithin(Math.random, 40)),
				)
			}}
		>
			<svg
				width={rows.length * boxSize}
				height={columns.length * boxSize}
				viewBox={`0 0 ${rows.length} ${columns.length}`}
			>
				{rows.map(x =>
					columns.map(y => {
						const xIndex = Math.floor(
							(x / rows.length) * manualColorsFill.length,
						)
						const yIndex = Math.floor(
							(y / columns.length) * manualColorsFill.length,
						)
						return (
							<ColorRect
								x={x}
								y={y}
								colors={[
									...manualColorsFill[xIndex],
									...manualColorsFill[yIndex],
								]}
								width="1"
								height="1"
								key={`demo-3-pixel-${x}-${y}`}
							/>
						)
					}),
				)}
			</svg>
		</DemoWrapper>
	)
}

function DemoFour() {
	const [rows, setRows] = useState(createArrayOfLength(88))
	const [columns, setColumns] = useState(createArrayOfLength(9))
	const [xSmoothness, setXSmoothness] = useState(20)
	const [ySmoothness, setYSmoothness] = useState(20)
	const [useRandom, setUseRandom] = useState(false)
	const noise2D = useMemo(
		() => createNoise2D(useRandom ? Math.random : () => 0.26),
		[useRandom],
	)
	const boxSize = 6

	return (
		<DemoWrapper
			className="min-h-[410px]"
			onClick={() => {
				setRows(
					createArrayOfLength(getRandomPositiveIntWithin(Math.random, 100)),
				)
				setColumns(
					createArrayOfLength(getRandomPositiveIntWithin(Math.random, 40)),
				)
				setUseRandom(true)
			}}
		>
			<svg
				width={rows.length * boxSize}
				height={columns.length * boxSize}
				viewBox={`0 0 ${rows.length} ${columns.length}`}
			>
				{rows.map(x =>
					columns.map(y => (
						<NoiseRect
							x={x}
							y={y}
							colors={simpleColorsFill}
							noise={noise2D(x / xSmoothness, y / ySmoothness)}
							width="1"
							height="1"
							key={`demo-4-pixel-${x}-${y}`}
						/>
					)),
				)}
			</svg>
			<div className="absolute bottom-4 left-4 flex flex-col gap-1 font-mono text-xs">
				<div className="flex items-center gap-2">
					<input
						type="range"
						id="xSmoothness"
						name="xSmoothness"
						min="1"
						max="30"
						value={xSmoothness}
						onChange={e => setXSmoothness(e.target.valueAsNumber)}
						className="h-2 w-24 cursor-pointer appearance-none overflow-hidden rounded-none bg-transparent outline-none [--c:hsl(var(--pink))]"
					/>
					<label htmlFor="xSmoothness">X Smoothness</label>
				</div>
				<div className="flex items-center gap-2">
					<input
						type="range"
						id="ySmoothness"
						name="ySmoothness"
						min="1"
						max="30"
						value={ySmoothness}
						onChange={e => setYSmoothness(e.target.valueAsNumber)}
						className="h-2 w-24 cursor-pointer appearance-none overflow-hidden rounded-none bg-transparent outline-none [--c:hsl(var(--blue))]"
					/>
					<label htmlFor="ySmoothness">Y Smoothness</label>
				</div>
			</div>
		</DemoWrapper>
	)
}

function DemoFive() {
	const [seedOne, setSeedOne] = useState<number>(99)
	const [seedTwo, setSeedTwo] = useState<number>(99)

	const outputOne = useMemo(() => {
		const generator = Alea(seedOne)
		return [generator(), generator(), generator(), generator()]
	}, [seedOne])

	const outputTwo = useMemo(() => {
		const generator = Alea(seedTwo)
		return [generator(), generator(), generator(), generator()]
	}, [seedTwo])

	return (
		<div className="relative grid items-center gap-6 rounded-xl border border-gray-200 bg-gray-100 p-12 md:-mx-10 md:grid-cols-2 lg:-mx-12">
			<div>
				<div className="flex items-center gap-2 font-mono text-xs">
					<label htmlFor="seed">Seed One</label>
					<input
						type="number"
						min="1"
						max="100"
						id="seed"
						name="seed"
						value={seedOne}
						onChange={e => {
							setSeedOne(e.target.valueAsNumber)
						}}
						className="w-28 rounded-none border border-foreground px-1.5 py-0.5"
					/>
				</div>

				{outputOne?.length ? (
					<div className="not-prose mt-6 flex flex-col gap-2 text-sm">
						{outputOne.map(o => (
							<p className="text-bold font-mono" key={`output-${o}`}>
								{o}
							</p>
						))}
					</div>
				) : null}
			</div>
			<div>
				<div className="flex items-center gap-2 font-mono text-xs">
					<label htmlFor="seed">Seed Two</label>
					<input
						type="number"
						min="1"
						max="100"
						id="seed"
						name="seed"
						value={seedTwo}
						onChange={e => {
							setSeedTwo(e.target.valueAsNumber)
						}}
						className="w-28 rounded-none border border-foreground px-1.5 py-0.5"
					/>
				</div>

				{outputTwo?.length ? (
					<div className="not-prose mt-6 flex flex-col gap-2 text-sm">
						{outputTwo.map(o => (
							<p className="text-bold font-mono" key={`output-${o}`}>
								{o}
							</p>
						))}
					</div>
				) : null}
			</div>
		</div>
	)
}

function DemoSix() {
	const [seed, setSeed] = useState<number>(99)

	const generator = useMemo(() => {
		return Alea(seed)
	}, [seed])

	const noise2D = useMemo(() => createNoise2D(generator), [generator])

	const rowRandomNumber = useMemo(() => generator(), [generator])
	const columnRandomNumber = useMemo(() => generator(), [generator])
	const rows = createArrayOfLength(Math.floor(rowRandomNumber * 100))
	const columns = createArrayOfLength(Math.floor(columnRandomNumber * 40))

	const [xSmoothness, setXSmoothness] = useState(20)
	const [ySmoothness, setYSmoothness] = useState(20)

	const boxSize = 6

	return (
		<div className="relative flex min-h-[410px] items-center justify-center rounded-xl border border-gray-200 bg-gray-100 p-12 md:-mx-10 lg:-mx-12">
			<svg
				width={rows.length * boxSize}
				height={columns.length * boxSize}
				viewBox={`0 0 ${rows.length} ${columns.length}`}
			>
				{rows.map(x =>
					columns.map(y => (
						<NoiseRect
							x={x}
							y={y}
							colors={simpleColorsFill}
							noise={noise2D(x / xSmoothness, y / ySmoothness)}
							width="1"
							height="1"
							key={`demo-6-pixel-${x}-${y}`}
						/>
					)),
				)}
			</svg>
			<div className="absolute bottom-4 left-4 flex flex-col gap-1 font-mono text-xs">
				<div className="flex items-center gap-2">
					<input
						type="range"
						id="xSmoothness"
						name="xSmoothness"
						min="1"
						max="30"
						value={xSmoothness}
						onChange={e => setXSmoothness(e.target.valueAsNumber)}
						className="h-2 w-24 cursor-pointer appearance-none overflow-hidden rounded-none bg-transparent outline-none [--c:hsl(var(--pink))]"
					/>
					<label htmlFor="xSmoothness">X Smoothness</label>
				</div>
				<div className="flex items-center gap-2">
					<input
						type="range"
						id="ySmoothness"
						name="ySmoothness"
						min="1"
						max="30"
						value={ySmoothness}
						onChange={e => setYSmoothness(e.target.valueAsNumber)}
						className="h-2 w-24 cursor-pointer appearance-none overflow-hidden rounded-none bg-transparent outline-none [--c:hsl(var(--blue))]"
					/>
					<label htmlFor="ySmoothness">Y Smoothness</label>
				</div>
			</div>
			<div className="absolute bottom-4 right-4 flex items-center gap-2 font-mono text-xs">
				<label htmlFor="seed">Seed</label>
				<input
					type="number"
					min="1"
					max="100"
					id="seed"
					name="seed"
					value={seed}
					onChange={e => setSeed(e.target.valueAsNumber)}
					className="w-28 rounded-none border border-foreground px-1.5 py-0.5"
				/>
			</div>
		</div>
	)
}

export function DemoPreview() {
	const [rows, setRows] = useState(createArrayOfLength(73))
	const [columns, setColumns] = useState(createArrayOfLength(9))
	const [xSmoothness, setXSmoothness] = useState(20)
	const [ySmoothness, setYSmoothness] = useState(20)
	const [useRandom, setUseRandom] = useState(false)
	const noise2D = useMemo(
		() => createNoise2D(useRandom ? Math.random : () => 0.1176),
		[useRandom],
	)
	const boxSize = 3

	return (
		<div className="relative flex min-h-[205px] items-center justify-center border-b border-gray-200 bg-gray-100 p-6">
			<svg
				className="-mt-12"
				width={rows.length * boxSize}
				height={columns.length * boxSize}
				viewBox={`0 0 ${rows.length} ${columns.length}`}
			>
				{rows.map(x =>
					columns.map(y => (
						<NoiseRect
							x={x}
							y={y}
							colors={simpleColorsFill}
							noise={noise2D(x / xSmoothness, y / ySmoothness)}
							width="1"
							height="1"
							key={`demo-preview-pixel-${x}-${y}`}
						/>
					)),
				)}
			</svg>
			<div className="absolute bottom-4 left-4 flex flex-col gap-1 font-mono text-xs">
				<div className="flex items-center gap-2">
					<input
						type="range"
						id="xSmoothness"
						name="xSmoothness"
						min="1"
						max="30"
						value={xSmoothness}
						onChange={e => setXSmoothness(e.target.valueAsNumber)}
						className="h-2 w-24 cursor-pointer appearance-none overflow-hidden rounded-none bg-transparent outline-none [--c:hsl(var(--pink))]"
					/>
					<label htmlFor="xSmoothness">X Smoothness</label>
				</div>
				<div className="flex items-center gap-2">
					<input
						type="range"
						id="ySmoothness"
						name="ySmoothness"
						min="1"
						max="30"
						value={ySmoothness}
						onChange={e => setYSmoothness(e.target.valueAsNumber)}
						className="h-2 w-24 cursor-pointer appearance-none overflow-hidden rounded-none bg-transparent outline-none [--c:hsl(var(--blue))]"
					/>
					<label htmlFor="ySmoothness">Y Smoothness</label>
				</div>
			</div>
			<button
				onClick={() => {
					setRows(
						createArrayOfLength(getRandomPositiveIntWithin(Math.random, 100)),
					)
					setColumns(
						createArrayOfLength(getRandomPositiveIntWithin(Math.random, 25)),
					)
					setUseRandom(true)
				}}
				className="group absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 font-mono text-xs hover:bg-gray-200"
			>
				<svg
					className="absolute -right-px -top-px h-[24px] w-[24px] rotate-0"
					viewBox="0 0 4 4"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<rect
						className="fill-transparent group-hover:fill-gray-100"
						x="0"
						y="0"
						width="4"
						height="4"
					/>
					<path
						d="M 0 0 H 2 V 1 H 3 V 2 H 4 V 4 H 0 V 0 Z"
						className="fill-transparent group-hover:fill-gray-200"
					/>
				</svg>
				<span>Refresh</span>
				<span className="h-auto w-4 transition group-hover:rotate-90">
					<RefreshIcon />
				</span>
			</button>
		</div>
	)
}

function Callout({ children }: PropsWithChildren<{}>) {
	return (
		<div className="dark prose-invert relative bg-background p-8 text-foreground">
			<svg
				className="absolute right-0 top-0 h-[24px] w-[24px] rotate-0"
				viewBox="0 0 4 4"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<rect className="fill-foreground" x="0" y="0" width="4" height="4" />
				<path
					d="M 0 0 H 2 V 1 H 3 V 2 H 4 V 4 H 0 V 0 Z"
					className="fill-background"
				/>
			</svg>
			{children}
		</div>
	)
}

function ColorRect({
	colors,
	...props
}: ComponentProps<'rect'> & { colors: string[] }) {
	const [color, setColor] = useState(colors[0])
	useEffect(() => {
		setColor(generateColor(Math.random, colors))
	}, [colors])
	return <rect {...props} className={color} />
}

function NoiseRect({
	noise,
	colors,
	...props
}: ComponentProps<'rect'> & { noise: number; colors: string[] }) {
	const color = getColorByNoise(colors, noise)
	return <rect {...props} className={color} />
}

function CodeBlock({
	code,
	size,
	setSize,
}: {
	code: string
	size: 'text-sm' | 'text-base' | 'text-lg'
	setSize(v: 'text-sm' | 'text-base' | 'text-lg'): void
}) {
	return (
		<div className="relative md:-mx-10 lg:-mx-12">
			<div
				dangerouslySetInnerHTML={{ __html: code }}
				className={clsx(
					size,
					'[&>*]:rounded-xl [&>*]:border [&>*]:border-gray-200 [&>*]:pt-4',
				)}
			/>
			<form className="absolute right-2 top-2">
				<RadioGroup
					name="size"
					value={size}
					onChange={v => setSize(v)}
					className="flex rounded-md border border-foreground p-0.5 font-mono text-xs backdrop-blur"
				>
					<Radio
						value="text-sm"
						className={clsx(
							size === 'text-sm'
								? 'bg-foreground text-background'
								: 'bg-transparent',
							'cursor-pointer rounded-sm px-1.5 pb-0.5',
						)}
					>
						sm
					</Radio>
					<Radio
						value="text-base"
						className={clsx(
							size === 'text-base'
								? 'bg-foreground text-background'
								: 'bg-transparent',
							'cursor-pointer rounded-sm px-1.5 pb-0.5',
						)}
					>
						md
					</Radio>
					<Radio
						value="text-lg"
						className={clsx(
							size === 'text-lg'
								? 'bg-foreground text-background'
								: 'bg-transparent',
							'cursor-pointer rounded-sm px-1.5 pb-0.5',
						)}
					>
						lg
					</Radio>
				</RadioGroup>
			</form>
		</div>
	)
}

function Code({ children }: PropsWithChildren) {
	return (
		<code className="inline-block bg-gray-100 text-sm text-purple before:hidden after:hidden">
			{children}
		</code>
	)
}

/**
 * UTILS
 */

/**
 * This function will give us a random color from the array of colors
 * we have defined using the `getRandomPositiveIntWithin`. We use the
 * length of the colors array to make sure the index lookup will be
 * guaranteed to find a match.
 **/
function generateColor(prng: () => number, colors: string[]) {
	return colors[getRandomPositiveIntWithin(prng, colors.length)]
}

/**
 * This function is used to return a random positive integer (whole number)
 * that will never be any larger than the max integer you pass in.
 * This is extremely useful when trying to get a randomized value from
 * an array.
 **/
function getRandomPositiveIntWithin(prng: () => number, max: number) {
	return Math.floor(prng() * max)
}

function createArrayOfLength(length: number): number[] {
	return Array.from(Array(length === 0 ? 1 : length), (_, i) => i)
}

/**
 * Simplex Noise generates a value between -1 and 1, but we are working with an
 * array that will not accept a negative index. We will be converting the original
 * noise range to fit the 0 to 1 scale we need.
 **/
function getColorByNoise(colors: string[], noise: number) {
	return colors[Math.floor(((noise + 1) / 2) * colors.length)]
}

/**
 * DATA
 */
const simpleColorsBg = [
	'bg-purple',
	'bg-blue',
	'bg-green',
	'bg-lime',
	'bg-yellow',
	'bg-pink',
	'bg-orange',
]

const manualColorsFill = [
	['fill-blue', 'fill-purple', 'fill-purple'],
	['fill-green', 'fill-blue', 'fill-purple'],
	['fill-green', 'fill-blue', 'fill-purple'],
	['fill-lime', 'fill-green', 'fill-blue'],
	['fill-yellow', 'fill-lime', 'fill-green', 'fill-blue'],
	['fill-yellow', 'fill-lime', 'fill-green'],
	['fill-pink', 'fill-yellow', 'fill-lime', 'fill-green'],
	['fill-pink', 'fill-yellow', 'fill-lime'],
	['fill-pink', 'fill-orange', 'fill-yellow'],
	['fill-pink', 'fill-orange', 'fill-orange'],
]

const simpleColorsFill = [
	'fill-purple',
	'fill-blue',
	'fill-green',
	'fill-lime',
	'fill-yellow',
	'fill-pink',
	'fill-orange',
]

const coordinates: Array<[number, number]> = [
	[0, 3],
	[0, 4],
	[0, 15],
	[1, 2],
	[1, 3],
	[1, 4],
	[1, 5],
	[1, 14],
	[1, 15],
	[2, 1],
	[2, 2],
	[2, 4],
	[2, 5],
	[2, 8],
	[2, 13],
	[2, 14],
	[2, 15],
	[2, 16],
	[3, 0],
	[3, 1],
	[3, 4],
	[3, 5],
	[3, 7],
	[3, 8],
	[3, 10],
	[3, 11],
	[3, 12],
	[3, 14],
	[3, 15],
	[4, 0],
	[4, 1],
	[4, 4],
	[4, 5],
	[4, 7],
	[4, 8],
	[4, 9],
	[4, 11],
	[4, 12],
	[4, 14],
	[4, 15],
	[5, 0],
	[5, 1],
	[5, 2],
	[5, 3],
	[5, 4],
	[5, 5],
	[5, 7],
	[5, 8],
	[5, 14],
	[5, 15],
	[6, 0],
	[6, 1],
	[6, 4],
	[6, 5],
	[6, 7],
	[6, 8],
	[6, 14],
	[6, 15],
	[7, 0],
	[7, 1],
	[7, 4],
	[7, 5],
	[7, 7],
	[7, 8],
	[7, 13],
	[7, 14],
]

const exampleOne = `/** 
* This function is used to return a random positive integer (whole number) 
* that will never be any larger than the max integer you pass in. 
* This is extremely useful when trying to get a randomized value from 
* an array.
**/
function getRandomPositiveIntWithin(max: number) { 
  return Math.floor(Math.random() * max)
} 

/** 
* This function will give us a random color from the array of colors
* we have defined using the \`getRandomPositiveIntWithin\`. We use the
* length of the colors array to make sure the index lookup will be
* guaranteed to find a match.
**/
function generateColor() {
  const colors = []
  return colors[getRandomPositiveIntWithin(colors.length)]
}

function ColorBox() { 
  const color = generateColor() 
  return <div className="w-12 h-12" style={{ backgroundColor: color }} />
}`

const exampleTwo = `/**
 * I am using tailwind classes for existing color variables on my site, but
 * you can use hex codes, hsl values, or any supported color property
 **/
const colors = [
	'bg-pink',
	'bg-orange',
	'bg-yellow',
	'bg-lime',
	'bg-green',
	'bg-blue',
	'bg-purple',
]

/** 
* This function is used to return a random positive integer (whole number) 
* that will never be any larger than the max integer you pass in. 
* This is extremely useful when trying to get a randomized value from 
* an array.
**/
function getRandomPositiveIntWithin(max: number) { 
  return Math.floor(Math.random() * max)
} 

/** 
* This function will give us a random color from the array of colors
* we have defined using the \`getRandomPositiveIntWithin\`. We use the
* length of the colors array to make sure the index lookup will be
* guaranteed to find a match.
**/
function generateColor() {
  return colors[getRandomPositiveIntWithin(colors.length)]
}

/** 
* This function will allow us to pass a length we need and array to be
* and will return an array where each value in the array is its index.
* Useful for creating rows and columns as seen below.
**/
function createArrayOfLength(length: number): number[] {
	return Array.from(Array(length), (_, i) => i)
}

function ColorBox(props: ComponentProps<'rect'>) { 
  const color = generateColor() 
  return <rect {...props} className={color} />
}

function ColorGrid() { 
  const rows = createArrayOfLength(getRandomPositiveIntWithin(100))
  const columns = createArrayOfLength(getRandomPositiveIntWithin(40))
  const boxSize = 6
  return (
    <svg 
      width={rows * boxSize} 
      height={columns * boxSize} 
      viewBox={\`0 0 \${rows} \${columns}\`}
    > 
      {rows.map((x => columns.map(y => {
        <ColorBox
          x={x} 
          y={y}
          width="1"
          height="1"
          key={\`pixel-\${x}-\${y}\`}
        />
      ))
    </svg>
  )
}`

const exampleThree = `/** 
* Here is a manually setup array of colors that will map to percentages.
* There are 10 indexed positions that will allow us to have a color grouping 
* for every 10th of either the x or y axis.
**/
const colors = [
	['fill-blue', 'fill-purple', 'fill-purple'],
	['fill-green', 'fill-blue', 'fill-purple'],
	['fill-green', 'fill-blue', 'fill-purple'],
	['fill-lime', 'fill-green', 'fill-blue'],
	['fill-yellow', 'fill-lime', 'fill-green', 'fill-blue'],
	['fill-yellow', 'fill-lime', 'fill-green'],
	['fill-pink', 'fill-yellow', 'fill-lime', 'fill-green'],
	['fill-pink', 'fill-yellow', 'fill-lime'],
	['fill-pink', 'fill-orange', 'fill-yellow'],
	['fill-pink', 'fill-orange', 'fill-orange'],
]

/** 
* This function is used to return a random positive integer (whole number) 
* that will never be any larger than the max integer you pass in. 
* This is extremely useful when trying to get a randomized value from 
* an array.
**/
function getRandomPositiveIntWithin(max: number) { 
  return Math.floor(Math.random() * max)
} 

/** 
* This function will give us a random color from the array of colors
* we have defined using the \`getRandomPositiveIntWithin\`. We use the
* length of the colors array to make sure the index lookup will be
* guaranteed to find a match.
**/
function generateColor(colors: string[]) {
  return colors[getRandomPositiveIntWithin(colors.length)]
}

/** 
* This function will allow us to pass a length we need and array to be
* and will return an array where each value in the array is its index.
* Useful for creating rows and columns as seen below.
**/
function createArrayOfLength(length: number): number[] {
	return Array.from(Array(length), (_, i) => i)
}

function ColorBox({
	xPercent,
	yPercent,
	...props
}: ComponentProps<'rect'> & { xPercent: number; yPercent: number }) {
	const color = generateColor([...colors[xPercent], ...colors[yPercent]])
	return <rect {...props} className={color} />
}

function ColorGrid() { 
  const rows = createArrayOfLength(getRandomPositiveIntWithin(100))
  const columns = createArrayOfLength(getRandomPositiveIntWithin(40))
  const boxSize = 6
  return (
    <svg
		width={rows.length * boxSize}
		height={columns.length * boxSize}
		viewBox={\`0 0 \${rows.length} \${columns.length}\`}
	>
		{rows.map(x =>
			columns.map(y => (
				<ColorBox
					x={x}
					y={y}
					xPercent={Math.floor((x / rows.length) * colors.length)}
					yPercent={Math.floor((y / columns.length) * colors.length)}
					width="1"
					height="1"
					key={\`pixel-\${x}-\${y}\`}
				/>
			)),
		)}
	</svg>
  )
}`

const exampleFour = `import { makeNoise2D } from 'open-simplex-noise'

/** 
* Here we are just going back to our basic array of colors and will let the
* simplex noise algorithm pick what colors are being selected from this array
**/
const colors = [
	'fill-purple',
	'fill-blue',
	'fill-green',
	'fill-lime',
	'fill-yellow',
	'fill-pink',
	'fill-orange',
]

/** 
* This function is used to return a random positive integer (whole number) 
* that will never be any larger than the max integer you pass in. 
* This is extremely useful when trying to get a randomized value from 
* an array.
**/
function getRandomPositiveIntWithin(max: number) { 
  return Math.floor(Math.random() * max)
}

/**
 * Simplex Noise generates a value between -1 and 1, but we are working with an
 * array that will not accept a negative index. We will be converting the original
 * noise range to fit the 0 to 1 scale we need.
 **/
function getColorByNoise(noise: number) {
	return colors[Math.floor(((noise + 1) / 2) * colors.length)]
}

/** 
* This function will allow us to pass a length we need and array to be
* and will return an array where each value in the array is its index.
* Useful for creating rows and columns as seen below.
**/
function createArrayOfLength(length: number): number[] {
	return Array.from(Array(length === 0 ? 1 : length), (_, i) => i)
}

function ColorBox({
	noise,
	...props
}: ComponentProps<'rect'> & { noise: number }) {
	const color = getColorByNoise(noise)
	return <rect {...props} className={color} />
}

function ColorGrid() { 
  const rows = createArrayOfLength(getRandomPositiveIntWithin(100))
  const columns = createArrayOfLength(getRandomPositiveIntWithin(40))
  const boxSize = 6
  const xSmoothness = 20
  const ySmoothness = 20
  const noise2D = makeNoise2D(Math.random())
  return (
    <svg
		width={rows.length * boxSize}
		height={columns.length * boxSize}
		viewBox={\`0 0 \${rows.length} \${columns.length}\`}
	>
		{rows.map(x =>
			columns.map(y => (
				<ColorBox
					x={x}
					y={y}
					noise={noise2D(x / xSmoothness, y / ySmoothness)}
					width="1"
					height="1"
					key={\`pixel-\${x}-\${y}\`}
				/>
			)),
		)}
	</svg>
  )
}`

const exampleSix = `import Alea from 'alea'
import { makeNoise2D } from 'open-simplex-noise'

/** 
* Here we are just going back to our basic array of colors and will let the
* simplex noise algorithm pick what colors are being selected from this array
**/
const colors = [
	'fill-purple',
	'fill-blue',
	'fill-green',
	'fill-lime',
	'fill-yellow',
	'fill-pink',
	'fill-orange',
]

/** 
* This function is now updated to accept the random number and the max. This
* allows us to make sure that we are passing in a number we know is connected
* to our seeded PRNG.
**/
function getRandomPositiveIntWithin(randomNum: number, max: number) { 
  return Math.floor(randomNum * max)
} 

/**
 * Simplex Noise generates a value between -1 and 1, but we are working with an
 * array that will not accept a negative index. We will be converting the original
 * noise range to fit the 0 to 1 scale we need.
 **/
function getColorByNoise(noise: number) {
	return colors[Math.floor(((noise + 1) / 2) * colors.length)]
}

/** 
* This function will allow us to pass a length we need and array to be
* and will return an array where each value in the array is its index.
* Useful for creating rows and columns as seen below.
**/
function createArrayOfLength(length: number): number[] {
	return Array.from(Array(length === 0 ? 1 : length), (_, i) => i)
}

function ColorBox({
	noise,
	...props
}: ComponentProps<'rect'> & { noise: number }) {
	const color = getColorByNoise(noise)
	return <rect {...props} className={color} />
}

function ColorGrid() {
	const seed = 99
	const generator = Alea(seed)
	const rows = createArrayOfLength(getRandomPositiveIntWithin(generator(), 100))
	const columns = createArrayOfLength(getRandomPositiveIntWithin(generator(), 40))
	const boxSize = 6
	const xSmoothness = 20
	const ySmoothness = 20
	const noise2D = makeNoise2D(generator())
	return (
		<svg
			width={rows.length * boxSize}
			height={columns.length * boxSize}
			viewBox={\`0 0 \${rows.length} \${columns.length}\`}
		>
			{rows.map(x =>
				columns.map(y => (
					<ColorBox
						x={x}
						y={y}
						noise={noise2D(x / xSmoothness, y / ySmoothness)}
						width="1"
						height="1"
						key={\`pixel-\${x}-\${y}\`}
					/>
				)),
			)}
		</svg>
	)
}`
