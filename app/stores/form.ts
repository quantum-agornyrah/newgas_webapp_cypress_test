import { defineStore } from "pinia";
import { ref, watchEffect } from "vue";
// import { useRouter } from "vue-router";

export const useFormStore = defineStore("formStore", () => {
  const error = ref<string | null>(null);
  const success = ref<string | null>(null);
  const loading = ref<boolean>(false);
  const formIsValid = ref<boolean>(false);



  const rules = ref({
    required: (val: string) => {
      if (val) {
        return true;
      }
      return "Field is required";
    },
    email: (val: string) => {
      // must be a valid email
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(val)) {
        return true;
      }
      return "Must be a valid e-mail.";
    },
    password: (val: string) => {
      if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^*]).{8,}$/i.test(val)) {
        return true;
      }
      return "Password must contain at least one letter, one digit, one special character (@$!%*?&), and be at least 8 characters long";
    },
    amount: (val: string) => {
      // must not be less than 0
      if (parseFloat(val) > 0) {
        return true;
      }
      return "Must be a valid value";
    },
    accountNumber: (val: string) => {
      // must must be exactly 13 digits
      if (val.length >= 10 && val.length <= 15) {
        return true;
      }
      return "Must be a valid account number";
    },
    phoneNumber: (val: string) => {
      // must must be exactly 10 digits
      if (val?.length === 10) {
        return true;
      }
      return "Must be a valid phone number";
    },
  });

  // // reset form if route changes
  // const router = useRouter();
  // watch(router.currentRoute, () => {
  //   resetFormStore();
  // });

  // reset all values
  const resetFormStore = () => {
    error.value = null;
    success.value = null;
    loading.value = false;
    formIsValid.value = false;
  };

  watchEffect( ()=>{
      if (error.value) {
        setTimeout(() => {
          resetFormStore();
        }, 5000);
      
    }}
  );
  watchEffect( ()=>{
    if (success.value) {
      setTimeout(() => {
        resetFormStore();
      }, 3500);
    
  }}
);
  return {
    error,
    success,
    loading,
    formIsValid,
    rules,
    resetFormStore
  };
});
