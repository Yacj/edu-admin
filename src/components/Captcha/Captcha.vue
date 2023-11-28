<script setup lang="ts">
const props = defineProps({
  code: {
    type: String,
    default: '',
  },
  width: {
    type: Number,
    default: 112,
  },
  height: {
    type: Number,
    default: 36,
  },
  size: {
    type: Number,
    default: 1,
  },
})
const emit = defineEmits(['click'])
const codeText = ref('')
const verifyCanvas = ref(null)
function checkResult(verifyCode) {
    console.log('12')
  if (!verifyCode || verifyCode.length === 0) {
    return false
  }

  if (verifyCode.toLowerCase() !== codeText.value.toLowerCase()) {
    generateCode()
    return false
  }
  else {
    return true
  }
}

function randomNum(min, max) {
  return Number.parseInt(Math.random() * (max - min) + min)
}

function randomColor(min, max) {
  const r = randomNum(min, max)
  const g = randomNum(min, max)
  const b = randomNum(min, max)
  return `rgb(${r},${g},${b})`
}

function generateCode() {
  codeText.value = ''
  const ctx = verifyCanvas.value.getContext('2d')
  ctx.fillStyle = randomColor(230, 255)
  ctx.fillRect(0, 0, <number>props.width, <number>props.height)

  for (let i = 0; i < props.size; i++) {
    const currentText = `${props.code}`
    codeText.value += currentText
    ctx.font = '36px Simhei'
    ctx.fillStyle = randomColor(80, 150)
    ctx.fillText(currentText, (i + 1) * randomNum(20, 25), props.height / 2 + 13)
  }

  for (let i = 0; i < 5; i++) {
    ctx.beginPath()
    ctx.moveTo(randomNum(0, props.width), randomNum(0, props.height))
    ctx.lineTo(randomNum(0, props.width), randomNum(0, props.height))
    ctx.strokeStyle = randomColor(180, 230)
    ctx.closePath()
    ctx.stroke()
  }

  for (let i = 0; i < 40; i++) {
    ctx.beginPath()
    ctx.arc(randomNum(0, props.width), randomNum(0, props.height), 1, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.fillStyle = randomColor(150, 200)
    ctx.fill()
  }

  ctx.restore()
  ctx.save()
  console.log(codeText)
  return codeText
}

watch(() => props.code, () => {
    console.log('1')
  generateCode()
})
function refresh() {
  emit('click')
}

defineExpose({ checkResult, refresh })
</script>

<template>
  <canvas
    ref="verifyCanvas"
    class="canvas"
    :width="props.width"
    :height="props.height"
    @click="refresh"
  />
</template>

<style scoped>

</style>
