Rails.application.routes.draw do

  get 'fake_billing/show'

  get 'customers/index'

  devise_for :users
  root 'dashboard#index'
  get 'angular_test', to: "angular_test#index"
  get "fake_billing", to: "fake_billing#show"

  resources :customers, only: [:index, :show, :update]
  
end
