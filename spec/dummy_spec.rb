require 'rails_helper.rb'

describe "testing that rspc is configured" do 
	it "should pass" do 
		expect(true).to equal(true)
	end

	it "can fail" do
		expect(true).to eq(true)
	end
end