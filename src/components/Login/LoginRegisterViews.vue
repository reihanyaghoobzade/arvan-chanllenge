<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { object, string } from 'yup'
import { useLoginUser, useRegisterUser } from '../../composables/login-register'
import { useAuthStore } from '../../stores/auth'
import { useToastStore } from '../../stores/toast'
import { useYup } from '../../composables/use-yup'

const { isLoginPage } = defineProps({
  isLoginPage: {
    type: String,
    required: true
  }
})

const registerSchema = object({
  username: string().required('Username is required'),
  email: string().email().required('Email is required'),
  password: string().required('Password is required')
})

const loginSchema = object({
  email: string().email().required('Email is required'),
  password: string().required('Password is required')
})

const { validate: loginValidate, objectError: loginErrors } = useYup(loginSchema)
const { validate: registerValidate, objectError: registerErrors } = useYup(registerSchema)

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

const onSubmit = async () => {
  if (isLoginPage) {
    const isValidate = await loginValidate(formData)
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
    const isValidate = await registerValidate(formData)
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
            <label
              for="username"
              :class="['ms-2 mb-2', { 'text-danger': registerErrors.username }]"
            >
              User
            </label>
            <input
              v-model="formData.username"
              type="username"
              :class="['form-control', { 'border border-danger': registerErrors.username }]"
              id="username"
              required
            />
            <p v-if="registerErrors.username" class="text-danger">{{ registerErrors.username }}</p>
          </div>
          <div class="form-group mb-4">
            <label
              for="email"
              :class="['ms-2 mb-2', { 'text-danger': registerErrors.email || loginErrors.email }]"
            >
              Email
            </label>
            <input
              v-model="formData.email"
              type="email"
              :class="[
                'form-control',
                { 'border border-danger': registerErrors.email || loginErrors.email }
              ]"
              id="email"
              required
            />
            <p v-if="registerErrors.email || loginErrors.email" class="text-danger">
              {{ registerErrors.email || loginErrors.email }}
            </p>
          </div>
          <div class="form-group mb-4">
            <label
              for="password"
              :class="[
                'ms-2 mb-2',
                { 'text-danger': registerErrors.password || loginErrors.password }
              ]"
            >
              Password
            </label>
            <input
              v-model="formData.password"
              type="password"
              :class="[
                'form-control',
                { 'border border-danger': registerErrors.password || loginErrors.password }
              ]"
              id="password"
              required
            />
            <p v-if="registerErrors.password || loginErrors.password" class="text-danger">
              {{ registerErrors.password || loginErrors.password }}
            </p>
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
