class CustomersController < ApplicationController
  PAGE_SIZE = 10 
  def index
    @page = (params[:page] || 0).to_i 
  	@customers = Customer.all.limit(10)
  	if params[:keywords].present? 
  		@keyswords = params[:keywords]
  		customer_search_term = CustomerSearchTerm.new(@keyswords)
  		@customers = Customer.where(
  			           customer_search_term.where_clause,
  			           customer_search_term.where_args).
  					   order(customer_search_term.order).
               offset(PAGE_SIZE*@page).limit(PAGE_SIZE)
  	else
  		@customers=[]
  	end

    # existing index method
    respond_to do |format|
      format.html {}
      format.json { render json: @customers }
    end
    
  end
end