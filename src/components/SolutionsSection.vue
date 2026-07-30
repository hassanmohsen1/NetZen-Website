<script setup>
import { useLocale } from '@/composables/useLocale'
const { t } = useLocale()

const images = {
  cloudMigration:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDCDljd-dU6jBt56MvMdt9rN69WVGDcmyNUmZq6nArdvLVYFKx3GAzJULMojhmapKvCw1t1LGDnvUkEn2vHMw366I9AilrkxuNW4YuEhAff1upWtEao4x1eXEKCS4Sg3GO2c58nUh1jn-QBse9jz9ZojX_YcsyoZumrX7zEZTMFV8YMw-2lx8QPuud-_lwDDhL_LCGFBMllqT1d2EmeaScORb1Eh9sV3yQrGJGx0ERdmOoSaCsfq5WEPoTqoihfGKeo60F6jCKLNOY',
  hybridCloud:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDmlvISft7x_BymplaPh-Kp2nBaA8Onl5e0rmdSBKvz7_Xs0VbRQvJkxm2N06gu4eq1Lve6gzAcnN_ZO_Un6AU6eNNVlm-GgtZV3MvVR3jFHz9W3wGqyIkvPscwxUMA3DG00ZSiBX0La8KvRluWO6tXQWUANdz-V5anvfDUp-C8jEizrr0DVWBgtnt5Iz7s5P_x9M4l1rGTE9Wxesw8FBwTZyEk6w-RuIdCIIApMHd0l8aWFD2WcrAgQ9ul5t6j4FWmTz0e3aJegt4',
  globalNetworking:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBAioCHE4qNRAxfMCPREcb9Y0ENXay-NIDIFLAG1cvA2PT7UznyZXv_HfpEDtAMSONIc8aLytXq1RcMOfeOkBc_AaRIVFV_ALMw6R2mGI8SOGqR1Frw3NvJ44Mq07ZI9jVLV2fTRUaxwqEh3PVOXZBUBzvKbnWxOct1OygLhMxWoevtnkF-VJU21JUNQ-yQjYJLlIBuv-HDP4qJRzY84SSmAsDilBKcV-uX1IJui8ccVsxLImEqRXtM0TAmXCM9m_rYFZi-a0iBrdY',
  managedOps:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAsWvc84P0emF1xalFpnr3mnskm2Kweb4eSYQN98C-zV7BW8kXXv3QhjSm-MaXPAZsYtD5VQnN5eS620G_ivNs_BQkTuXvA69sHs31DPgd0fjKZP-Ta7t_LcRSAe_Iukq7iW1uNCKtHiUdqarkgPCQwr5iHq8Qie04PqBneiGZ7N7edEO2Y2GBriPm_E9L9ImWSgungVbkl2PbM_CfB7QfSgk-AZKZ2gvHBSlz1ZEranjrowqAKoCEw4Q7vqxXdxYSfd8e47JBUnCk',
}
</script>

<template>
  <section id="solutions" class="py-24 bg-surface-container-lowest">
    <div class="px-4 md:px-margin-desktop max-w-container-max mx-auto">
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 auto-rows-[250px] md:auto-rows-[300px]"
      >
        <!-- Cloud Migration (large) -->
        <div
          v-reveal class="bento-card md:col-span-2 relative group rounded-2xl"
        >
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"
          />
          <img
            :src="images.cloudMigration"
            alt=""
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div class="absolute bottom-0 start-0 p-6 md:p-10 z-20">
            <h3 class="text-on-primary text-headline-sm md:text-headline-md font-semibold mb-2">
              {{ t('solutions.cloudMigration') }}
            </h3>
            <p
              class="text-on-primary/80 text-body-md mb-4 md:mb-6 max-w-lg hidden sm:block"
            >
              {{ t('solutions.cloudMigrationDesc') }}
            </p>
            <button
              class="bg-primary text-on-primary px-6 py-3 rounded-xl text-label-md font-medium"
            >
              {{ t('solutions.viewCaseStudy') }}
            </button>
          </div>
        </div>

        <!-- Hybrid Cloud -->
        <div v-reveal class="bento-card relative group rounded-2xl">
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"
          />
          <img
            :src="images.hybridCloud"
            alt=""
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div class="absolute bottom-0 start-0 p-6 md:p-10 z-20">
            <h3 class="text-on-primary text-headline-sm font-semibold mb-2">
              {{ t('solutions.hybridCloud') }}
            </h3>
            <button
              class="text-on-primary text-label-md font-medium border-b border-white/40"
            >
              {{ t('services.learnMore') }}
            </button>
          </div>
        </div>

        <!-- Global Networking -->
        <div v-reveal class="bento-card relative group rounded-2xl">
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"
          />
          <img
            :src="images.globalNetworking"
            alt=""
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div class="absolute bottom-0 start-0 p-6 md:p-10 z-20">
            <h3 class="text-on-primary text-headline-sm font-semibold mb-2">
              {{ t('solutions.globalNetworking') }}
            </h3>
            <button
              class="text-on-primary text-label-md font-medium border-b border-white/40"
            >
              {{ t('services.learnMore') }}
            </button>
          </div>
        </div>

        <!-- Managed Ops (large) -->
        <div
          v-reveal class="bento-card md:col-span-2 relative group rounded-2xl"
        >
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"
          />
          <img
            :src="images.managedOps"
            alt=""
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div class="absolute bottom-0 start-0 p-6 md:p-10 z-20">
            <h3 class="text-on-primary text-headline-sm md:text-headline-md font-semibold mb-2">
              {{ t('solutions.managedOps') }}
            </h3>
            <p
              class="text-on-primary/80 text-body-md mb-4 md:mb-6 max-w-lg hidden sm:block"
            >
              {{ t('solutions.managedOpsDesc') }}
            </p>
            <button
              class="bg-primary text-on-primary px-6 py-3 rounded-xl text-label-md font-medium"
            >
              {{ t('solutions.exploreOps') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
