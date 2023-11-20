<script setup>
import { computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { object, string } from 'yup'
import { useLoginUser, useRegisterUser } from '../composables/login-register'
import { useAuthStore } from '../stores/auth'
import { useToastStore } from '../stores/toast'

const registerSchema = object({
  username: string().required(),
  email: string().email().required(),
  password: string().required()
})

const loginSchema = object({
  email: string().email().required(),
  password: string().required()
})

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const { mutate: loginRequest, isPending: loginLoading } = useLoginUser()
const { mutate: registerRequest, isPending: registerLoading } = useRegisterUser()
const toast = useToastStore()
const formData = reactive({
  username: null,
  email: null,
  password: null
})
const showError = reactive({
  username: false,
  email: false,
  password: false
})

const isLoginPage = computed(() => route.name === 'login')

const validateForm = async (schema) => {
  showError.username = false
  showError.email = false
  showError.password = false

  try {
    await schema.validate(formData, { abortEarly: false })
    return true
  } catch (err) {
    err.inner.forEach((error) => {
      showError[error.path] = true
    })
    return false
  }
}

const onSubmit = async () => {
  if (isLoginPage.value) {
    const isValidate = await validateForm(loginSchema)
    if (!isValidate) return

    loginRequest(
      {
        user: {
          email: formData.email,
          password: formData.password
        }
      },
      {
        onSuccess: ({ user }) => {
          auth.afterSuccessLogin(user)
          router.push({ path: '/articles' })
        },
        onError: () => {
          toast.showToast()
          toast.setInfo({
            title: 'Oops!',
            message: 'Something went wrong.',
            type: 'error'
          })
        }
      }
    )
  } else {
    const isValidate = await validateForm(registerSchema)
    if (!isValidate) return

    registerRequest(
      {
        user: {
          username: formData.username,
          email: formData.email,
          password: formData.password
        }
      },
      {
        onSuccess: ({ user }) => {
          auth.afterSuccessLogin(user)
          router.push({ path: '/articles' })
        },
        onError: () => {
          toast.showToast()
          toast.setInfo({
            title: 'Oops!',
            message: 'Something went wrong.',
            type: 'error'
          })
        }
      }
    )
  }
}

const onChangeRoute = () => {
  showError.username = false
  showError.email = false
  showError.password = false
}
</script>

<template>
  <main class="container">
    <div class="login d-flex justify-content-center align-items-center">
      <div class="w-100 login__box">
        <h1 class="login__name text-center mb-4">
          {{ isLoginPage ? 'LOGIN' : 'Register' }}
        </h1>
        <form class="d-flex flex-column justify-content-center">
          <div v-if="!isLoginPage" class="form-group mb-4">
            <label for="username" :class="['ms-2 mb-2', { 'text-danger': showError.username }]">
              User
            </label>
            <input
              v-model="formData.username"
              type="username"
              :class="['form-control', { 'border border-danger': showError.username }]"
              id="username"
              required
            />
            <p v-if="showError.username" class="text-danger">Required field</p>
          </div>
          <div class="form-group mb-4">
            <label for="email" :class="['ms-2 mb-2', { 'text-danger': showError.email }]">
              Email
            </label>
            <input
              v-model="formData.email"
              type="email"
              :class="['form-control', { 'border border-danger': showError.email }]"
              id="email"
              required
            />
            <p v-if="showError.email" class="text-danger">Required field</p>
          </div>
          <div class="form-group mb-4">
            <label for="password" :class="['ms-2 mb-2', { 'text-danger': showError.password }]">
              Password
            </label>
            <input
              v-model="formData.password"
              type="password"
              :class="['form-control', { 'border border-danger': showError.password }]"
              id="password"
              required
            />
            <p v-if="showError.password" class="text-danger">Required field</p>
          </div>
          <button
            type="submit"
            :class="['btn btn-primary', { disabled: loginLoading || registerLoading }]"
            @click.prevent="onSubmit"
            :disabled="loginLoading || registerLoading"
          >
            <span
              v-if="loginLoading || registerLoading"
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            {{ isLoginPage ? 'Login' : 'Register' }}
          </button>
        </form>
        <div class="mt-3 d-flex gap-2 align-items-center login__go-to-register">
          <span>Already Registered?</span>
          <RouterLink
            class="fw-bold login__go-to-register"
            :to="{ path: isLoginPage ? '/register' : 'login' }"
            @click="onChangeRoute"
            >{{ isLoginPage ? 'Register Now' : 'Login' }}</RouterLink
          >
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
.login {
  min-height: 100vh;
}

.login__box {
  background-color: var(--silver);
  padding: 2.25rem 1.25rem 1.25rem;
  border-radius: 0.25rem;
  @include media-breakpoint-up('md') {
    width: 450px !important;
  }
}

.login__name {
  color: var(--warm-gray);
}

.login__go-to-register {
  color: var(--charcoal-grey);
  text-decoration: none;
}
</style>
