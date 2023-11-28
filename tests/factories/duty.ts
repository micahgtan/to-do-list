import { Factory } from 'rosie'

Factory.define('service.duty_database.record.duty.1')
    .attr('id', 'duty-1')
    .attr('account_id', 'account-1')
    .attr('name', 'name_1')
    .attr('created_at', new Date().toISOString())
    .attr('updated_at', new Date().toISOString())

Factory.define('service.duty_database.record.duty.2')
    .attr('id', 'duty-2')
    .attr('account_id', 'account-1')
    .attr('name', 'name_2')
    .attr('created_at', new Date().toISOString())
    .attr('updated_at', new Date().toISOString())
